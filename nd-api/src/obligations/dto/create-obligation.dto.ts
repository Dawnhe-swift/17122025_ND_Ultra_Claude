import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ObligationStatus } from '../obligation.entity';

export class CreateObligationDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsDateString()
  dueDate: string;

  @IsEnum(ObligationStatus)
  @IsOptional()
  status?: ObligationStatus;

  @IsUUID()
  companyId: string;

  @IsUUID()
  @IsOptional()
  directorId?: string;
}

