import { IsString } from 'class-validator';

export class CloseObligationDto {
  @IsString()
  ndDecisionSummary: string;

  @IsString()
  ndNotes: string;
}

