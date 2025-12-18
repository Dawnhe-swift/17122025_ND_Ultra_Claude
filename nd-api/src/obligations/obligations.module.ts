import { Module } from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { ObligationsController } from './obligations.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [SupabaseModule, ActionsModule],
  controllers: [ObligationsController],
  providers: [ObligationsService],
  exports: [ObligationsService],
})
export class ObligationsModule {}


