import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { PDFGeneratorService } from './pdf-generator.service';

@Injectable()
export class ExportService {
  private readonly supabase: SupabaseClient;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly pdfGenerator: PDFGeneratorService,
  ) {
    this.supabase = this.supabaseService.getClient();
  }

  async generateDefensePack(companyUen: string): Promise<{ pdf: Buffer; csv: string }> {
    const companyRes = await this.supabase.from('companies').select('*').eq('uen', companyUen).single();
    if (companyRes.error) throw new HttpException(companyRes.error.message, HttpStatus.BAD_REQUEST);

    const obligationsRes = await this.supabase
      .from('legal_obligations')
      .select('*')
      .eq('company_uen', companyUen);
    if (obligationsRes.error) throw new HttpException(obligationsRes.error.message, HttpStatus.BAD_REQUEST);

    const lines = [
      `Company: ${companyRes.data.company_name}`,
      `UEN: ${companyRes.data.uen}`,
      `Risk: ${companyRes.data.risk_flag}`,
      `Obligations: ${obligationsRes.data.length}`,
    ];
    const pdf = await this.pdfGenerator.generatePdf('Defense Pack', lines);
    const csv = ['obligation_type,status,statutory_due_date']
      .concat(
        (obligationsRes.data ?? []).map(
          (o) => `${o.obligation_type},${o.status},${new Date(o.statutory_due_date).toISOString()}`,
        ),
      )
      .join('\n');

    return { pdf, csv };
  }

  async generateObligationReport(filters?: { status?: string }): Promise<Buffer> {
    let query = this.supabase.from('legal_obligations').select('*');
    if (filters?.status) query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

    const lines = (data ?? []).map(
      (o) => `Obligation: ${o.obligation_type} | Status: ${o.status} | Due: ${o.statutory_due_date}`,
    );
    return this.pdfGenerator.generatePdf('Obligation Report', lines);
  }
}

