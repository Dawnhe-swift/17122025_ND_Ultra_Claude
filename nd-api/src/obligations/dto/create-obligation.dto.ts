import { IsDateString, IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateObligationDto {
  @IsString()
  @MaxLength(10)
  company_uen: string;

  @IsString()
  @MaxLength(50)
  obligation_type: string;

  @IsDateString()
  statutory_due_date: string;

  @IsOptional()
  @IsIn(['auto', 'email', 'letter'])
  trigger_source?: 'auto' | 'email' | 'letter';

  @IsOptional()
  @IsIn(['open', 'in_progress', 'completed', 'overdue', 'escalated', 'resigned_unresolved'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  nd_risk_level?: string;

  @IsOptional()
  @IsString()
  nd_decision_summary?: string;

  @IsOptional()
  @IsObject()
  red_flag_checklist?: Record<string, unknown>;
}

