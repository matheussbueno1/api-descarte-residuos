// src/points/dto/create-point.dto.ts
import { IsString, IsArray, IsOptional, IsEnum, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString() @IsOptional() street?: string;
  @IsString() @IsOptional() number?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsOptional() zip?: string;
}

export class CreatePointDto {
  @IsString() name: string;
  @IsString() neighborhood: string;
  @IsEnum(['public','private']) type: 'public' | 'private';
  @IsArray() @IsOptional() categories?: string[];
  @IsOptional() @ValidateNested() @Type(() => AddressDto) address?: AddressDto;
  @IsOptional() @IsObject() location?: any; // aceita { type: 'Point', coordinates: [lng, lat] } ou [lng, lat]
}
