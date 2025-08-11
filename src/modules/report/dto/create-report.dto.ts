import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  isForEventCancel: boolean;

  @IsBoolean()
  hasRecovery: boolean;

  @IsInt()
  @Min(1)
  appointmentId: number;

  @IsInt()
  @Min(1)
  createdById: number;
}