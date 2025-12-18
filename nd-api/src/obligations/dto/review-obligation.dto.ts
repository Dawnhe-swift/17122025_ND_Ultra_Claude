import { IsObject, IsOptional, IsString } from 'class-validator';

export class ReviewObligationDto {
  @IsString()
  ndNotes: string;

  @IsOptional()
  @IsObject()
  redFlagChecklist?: Record<string, unknown>;
}

