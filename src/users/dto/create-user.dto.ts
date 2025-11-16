// src/users/dto/create-user.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
