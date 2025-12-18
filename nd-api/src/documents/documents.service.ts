import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import * as crypto from 'crypto';

const DOCUMENT_BUCKET = 'nd-documents';

@Injectable()
export class DocumentsService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async uploadDocument(file: any, obligationId: string) {
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    const fileName = `${obligationId}/${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await this.supabase.storage
      .from(DOCUMENT_BUCKET)
      .upload(fileName, file.buffer, { contentType: file.mimetype });
    if (uploadError) throw new HttpException(uploadError.message, HttpStatus.BAD_REQUEST);

    const hash = this.generateDocumentHash(file.buffer);

    const { data, error } = await this.supabase
      .from('documents')
      .insert({
        obligation_id: obligationId,
        filename: file.originalname,
        file_path: fileName,
        file_hash: hash,
        uploaded_by: 'nd',
      })
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

    return { path: fileName, hash, record: data };
  }

  async getDocument(id: string) {
    const { data, error } = await this.supabase.from('documents').select('*').eq('id', id).single();
    if (error) throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    return data;
  }

  async getSignedUrl(id: string) {
    const doc = await this.getDocument(id);
    const { data, error } = await this.supabase.storage
      .from(DOCUMENT_BUCKET)
      .createSignedUrl(doc.file_path, 60 * 10); // 10 minutes
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data;
  }

  async verifyDocumentHash(id: string) {
    const doc = await this.getDocument(id);
    const { data, error } = await this.supabase.storage.from(DOCUMENT_BUCKET).download(doc.file_path);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    const buffer = Buffer.from(await data.arrayBuffer());
    const computed = this.generateDocumentHash(buffer);
    return { valid: computed === doc.file_hash, expected: doc.file_hash, computed };
  }

  generateDocumentHash(buffer: Buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}

