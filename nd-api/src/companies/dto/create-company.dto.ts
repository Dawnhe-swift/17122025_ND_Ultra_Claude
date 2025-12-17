import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  uen: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsUUID()
  @IsOptional()
  nomineeDirectorId?: string;
}

