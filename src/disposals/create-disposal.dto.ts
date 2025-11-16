// src/disposals/dto/create-disposal.dto.ts
import { IsString, IsMongoId, IsIn, IsOptional, IsDateString } from 'class-validator';

export class CreateDisposalDto {
  @IsString()
  userName: string;

  @IsMongoId()
  pointId: string;

  @IsIn(['plástico','papel','orgânico','eletrônico','vidro','outro'])
  wasteType: string;

  @IsOptional()
  @IsDateString()
  date?: string; // aceita ISO string; se vazio, o service usa new Date()
}
