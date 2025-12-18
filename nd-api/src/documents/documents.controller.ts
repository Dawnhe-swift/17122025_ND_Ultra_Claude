import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: any, @Body('obligationId') obligationId: string) {
    return this.documentsService.uploadDocument(file, obligationId);
  }

  @Get(':id')
  getDocument(@Param('id') id: string) {
    return this.documentsService.getDocument(id);
  }

  @Get(':id/download')
  getDownload(@Param('id') id: string) {
    return this.documentsService.getSignedUrl(id);
  }

  @Get(':id/verify')
  verify(@Param('id') id: string) {
    return this.documentsService.verifyDocumentHash(id);
  }
}

