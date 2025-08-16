// src/modules/appointment/mappers/appointment.mapper.ts
// Handles all mapping between Prisma <-> Domain <-> DTOs

import {
  Appointment as PrismaAppointmentModel,
  User as PrismaUserModel,
  Client as PrismaClientModel,
  Service as PrismaServiceModel,
} from '@prisma/client';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';

/** Shape esperado por el frontend para cada item (mantiene compat) */
export type AppointmentResponse = {
  id: number;
  date: Date;                    // Igual que hoy (Prisma serializa a ISO en JSON)
  status: AppointmentStatus;
  tag: string | null;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  clientId: number;
  serviceId: number | null;
  user: { id: number; name: string } | null;
  client: { id: number; name: string } | null;
  service: { id: number; name: string } | null;
};

/** Tipo auxiliar para cuando el adaptador Prisma hace include/select */
export type PrismaAppointmentWithIncludes = PrismaAppointmentModel & {
  user?: Pick<PrismaUserModel, 'id' | 'name'> | null;
  client?: Pick<PrismaClientModel, 'id' | 'name'> | null;
  service?: Pick<PrismaServiceModel, 'id' | 'name'> | null;
};

/** Prisma model -> Domain entity (sin objetos anidados) */
export function toDomain(model: PrismaAppointmentModel): Appointment {
  return new Appointment(
    model.id,
    model.date,
    model.status as AppointmentStatus,
    model.tag ?? null,
    model.isRecurring,
    model.createdAt,
    model.updatedAt,
    model.userId,
    model.clientId,
    model.serviceId ?? null,
  );
}

/** Prisma models array -> Domain entities array */
export function toDomainList(models: PrismaAppointmentModel[]): Appointment[] {
  return models.map(toDomain);
}

/**
 * Domain entity + relaciones mínimas -> Response (shape del front)
 * Separa dominio de presentación. Si no hay relaciones, devuelve nulls (compat).
 */
export function toResponse(
  entity: Appointment,
  relations?: {
    user?: { id: number; name: string } | null;
    client?: { id: number; name: string } | null;
    service?: { id: number; name: string } | null;
  },
): AppointmentResponse {
  return {
    id: entity.id,
    date: entity.date,
    status: entity.status,
    tag: entity.tag,
    isRecurring: entity.isRecurring,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    userId: entity.userId,
    clientId: entity.clientId,
    serviceId: entity.serviceId,
    user: relations?.user ?? null,
    client: relations?.client ?? null,
    service: relations?.service ?? null,
  };
}

/**
 * Conveniencia: Prisma (con include/select) -> Response directo.
 * Útil en el adaptador para evitar reconsultas.
 */
export function toResponseFromPrisma(
  model: PrismaAppointmentWithIncludes,
): AppointmentResponse {
  const entity = toDomain(model);
  return toResponse(entity, {
    user: model.user ? { id: model.user.id, name: model.user.name } : null,
    client: model.client ? { id: model.client.id, name: model.client.name } : null,
    service: model.service ? { id: model.service.id, name: model.service.name } : null,
  });
}

/** Domain entities + relaciones -> Response DTOs array */
export function toResponseList(
  entities: Appointment[],
  relations?: Array<{
    user?: { id: number; name: string } | null;
    client?: { id: number; name: string } | null;
    service?: { id: number; name: string } | null;
  }>,
): AppointmentResponse[] {
  if (!relations) return entities.map((e) => toResponse(e));
  return entities.map((e, i) => toResponse(e, relations[i]));
}

/** Prisma array con include/select -> Response DTOs array */
export function toResponseListFromPrisma(
  models: PrismaAppointmentWithIncludes[],
): AppointmentResponse[] {
  return models.map(toResponseFromPrisma);
}
