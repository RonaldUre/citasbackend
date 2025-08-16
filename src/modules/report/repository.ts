// src/modules/report/repository.ts
// Port (domain contract) — no NestJS/Prisma dependencies here.

import { ReportResponse, ReportDetailResponse } from "./mappers/report.mapper";

export type CreateReportInput = {
  description: string;
  isForEventCancel?: boolean;
  hasRecovery?: boolean;
  appointmentId: number;
  createdById: number;
};

export type UpdateReportInput = Partial<{
  description: string;
  isForEventCancel: boolean;
  hasRecovery: boolean;
  appointmentId: number;
  createdById: number;
}>;

export abstract class ReportRepository {
  /** Lista básica (sin includes) */
  abstract findMany(): Promise<ReportResponse[]>;

  /** Detalle con includes mínimos (createdBy, appointment) */
  abstract findByIdWithRelations(
    id: number
  ): Promise<ReportDetailResponse | null>;

  /** Crear y devolver básico (sin includes) */
  abstract create(data: CreateReportInput): Promise<ReportResponse>;

  /** Actualizar y devolver básico (sin includes) */
  abstract update(id: number, data: UpdateReportInput): Promise<ReportResponse>;

  /** Eliminar (idempotente) */
  abstract remove(id: number): Promise<void>;

  /** Conteo de reportes por cita (para batch exists) */
  abstract countByAppointmentIds(
    appointmentIds: number[]
  ): Promise<Array<{ appointmentId: number; _count: number }>>;

  abstract findLatestByAppointmentId(
  appointmentId: number
): Promise<ReportDetailResponse | null>;
}
