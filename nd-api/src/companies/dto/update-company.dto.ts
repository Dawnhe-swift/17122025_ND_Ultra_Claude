import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  uen?: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsUUID()
  @IsOptional()
  nomineeDirectorId?: string | null;
}

