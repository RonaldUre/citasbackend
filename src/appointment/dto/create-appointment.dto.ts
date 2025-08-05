import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  clientId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  serviceId?: number;
}