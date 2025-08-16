// src/modules/appointment/repository.ts
// Port (domain contract). Proyección compatible con el front por ahora.

import { AppointmentStatus } from './entities/appointment.entity';
import { AppointmentResponse } from './mappers/appointment.mapper';

/** Inputs de dominio (desacoplados de DTOs HTTP) */
export type CreateAppointmentInput = {
  date: Date;
  status?: AppointmentStatus;  // default en Prisma = PENDING
  tag?: string | null;
  isRecurring?: boolean;
  userId: number;
  clientId: number;
  serviceId?: number | null;
};

export type UpdateAppointmentInput = Partial<{
  date: Date;
  status: AppointmentStatus;
  tag: string | null;
  isRecurring: boolean;
  userId: number;
  clientId: number;
  serviceId: number | null;
}>;

export type FindManyParams = {
  page?: number;    // 1-based
  pageSize?: number; // mapea desde "limit" en el controller
  userId?: number;
  clientId?: number;
  status?: AppointmentStatus;
  from?: Date;      // rango por fecha
  to?: Date;
};

export abstract class AppointmentRepository {
  abstract findMany(params?: FindManyParams): Promise<{ items: AppointmentResponse[]; total: number }>;

  abstract findByIdWithRelations(id: number): Promise<AppointmentResponse | null>;

  abstract create(data: CreateAppointmentInput): Promise<AppointmentResponse>;

  abstract update(id: number, data: UpdateAppointmentInput): Promise<AppointmentResponse>;

  abstract updateStatus(id: number, status: AppointmentStatus): Promise<AppointmentResponse>;

  abstract remove(id: number): Promise<void>;
}
