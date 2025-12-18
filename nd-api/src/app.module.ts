import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { CompaniesModule } from './companies/companies.module';
import { ObligationsModule } from './obligations/obligations.module';
import { ActionsModule } from './actions/actions.module';
import { RiskModule } from './risk/risk.module';
import { DocumentsModule } from './documents/documents.module';
import { ExportModule } from './export/export.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    CompaniesModule,
    ObligationsModule,
    ActionsModule,
    RiskModule,
    DocumentsModule,
    ExportModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
