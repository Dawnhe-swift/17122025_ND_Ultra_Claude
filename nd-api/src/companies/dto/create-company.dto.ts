import { IsDateString, IsIn, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(1, 10)
  uen: string;

  @IsString()
  @MaxLength(255)
  company_name: string;

  @IsDateString()
  nd_appointment_start: string;

  @IsOptional()
  @IsDateString()
  fye_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  csp_contact?: string;

  @IsOptional()
  @IsIn(['active', 'dormant', 'resigned'])
  status?: 'active' | 'dormant' | 'resigned';

  @IsOptional()
  @IsIn(['normal', 'heightened', 'exit_recommended'])
  risk_flag?: 'normal' | 'heightened' | 'exit_recommended';
}

