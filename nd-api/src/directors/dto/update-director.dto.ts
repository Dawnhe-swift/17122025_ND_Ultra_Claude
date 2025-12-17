import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateDirectorDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

