// src/modules/report/mappers/report.mapper.ts
// Handles all mapping between Prisma <-> Domain <-> Responses

import {
  Report as PrismaReportModel,
  User as PrismaUserModel,
  Appointment as PrismaAppointmentModel,
} from '@prisma/client';
import { ReportEntity } from '../entities/report.entity';

/** Shape de respuesta "básico" (sin includes): usado en create, update, findAll */
export type ReportResponse = {
  id: number;
  description: string;
  isForEventCancel: boolean;
  hasRecovery: boolean;
  createdAt: Date;
  appointmentId: number;
  createdById: number;
};

/** Shape de respuesta "detalle" (con includes): usado en findOne */
export type ReportDetailResponse = ReportResponse & {
  createdBy: { id: number; name: string } | null;
  appointment: { id: number; date: Date; status: string } | null;
};

/** Aux: Prisma con includes mínimos usados en findOne */
export type PrismaReportWithIncludes = PrismaReportModel & {
  createdBy?: Pick<PrismaUserModel, 'id' | 'name'> | null;
  appointment?: Pick<PrismaAppointmentModel, 'id' | 'date' | 'status'> | null;
};

/** Prisma model -> Domain entity */
export function toDomain(model: PrismaReportModel): ReportEntity {
  return new ReportEntity(
    model.id,
    model.description,
    model.isForEventCancel,
    model.hasRecovery,
    model.createdAt,
    model.appointmentId,
    model.createdById,
  );
}

/** Prisma models array -> Domain entities array */
export function toDomainList(models: PrismaReportModel[]): ReportEntity[] {
  return models.map(toDomain);
}

/** Domain entity -> Basic response (sin includes) */
export function toResponse(entity: ReportEntity): ReportResponse {
  return {
    id: entity.id,
    description: entity.description,
    isForEventCancel: entity.isForEventCancel,
    hasRecovery: entity.hasRecovery,
    createdAt: entity.createdAt,
    appointmentId: entity.appointmentId,
    createdById: entity.createdById,
  };
}

/** Domain entities -> Basic responses array */
export function toResponseList(entities: ReportEntity[]): ReportResponse[] {
  return entities.map(toResponse);
}

/** Prisma (con includes) -> Detail response (para findOne) */
export function toDetailResponseFromPrisma(model: PrismaReportWithIncludes): ReportDetailResponse {
  const base = toResponse(toDomain(model));
  return {
    ...base,
    createdBy: model.createdBy
      ? { id: model.createdBy.id, name: model.createdBy.name }
      : null,
    appointment: model.appointment
      ? { id: model.appointment.id, date: model.appointment.date, status: model.appointment.status }
      : null,
  };
}
