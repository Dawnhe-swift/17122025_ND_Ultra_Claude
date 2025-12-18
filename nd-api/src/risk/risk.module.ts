import { Module } from '@nestjs/common';
import { RiskService } from './risk.service';
import { ResignationTriggerService } from './resignation-trigger.service';
import { RiskController } from './risk.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [RiskController],
  providers: [RiskService, ResignationTriggerService],
  exports: [RiskService, ResignationTriggerService],
})
export class RiskModule {}


