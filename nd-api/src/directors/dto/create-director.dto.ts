import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateDirectorDto {
  @IsString()
  fullName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

