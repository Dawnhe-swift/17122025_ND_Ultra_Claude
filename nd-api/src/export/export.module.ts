import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { PDFGeneratorService } from './pdf-generator.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ExportController],
  providers: [ExportService, PDFGeneratorService],
})
export class ExportModule {}

