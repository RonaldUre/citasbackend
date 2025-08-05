import { IsNotEmpty, IsOptional, IsPositive, IsString, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPositive()
  @IsNumber()
  duration: number; // minutos

  @IsOptional()
  @IsNumber()
  price?: number;
}