import { AppointmentStatus } from '@prisma/client';

export class AppointmentResponseDto {
  id: number;
  date: Date;
  status: AppointmentStatus;
  tag?: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  clientId: number;
  serviceId?: number;
}