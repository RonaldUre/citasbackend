// src/modules/service/mappers/service.mapper.ts
// Handles all mapping between Prisma <-> Domain <-> Responses

import { Service as PrismaServiceModel } from '@prisma/client';
import { ServiceEntity } from '../entities/service.entity';

/** Shape de respuesta esperado por el front (igual a Prisma hoy) */
export type ServiceResponse = {
  id: number;
  name: string;
  description?: string;   // opcional en la respuesta si es null
  duration: number;
  price?: number;         // opcional en la respuesta si es null
  createdAt: Date;
};

/** Prisma model -> Domain entity */
export function toDomain(model: PrismaServiceModel): ServiceEntity {
  return new ServiceEntity(
    model.id,
    model.name,
    model.description ?? null,
    model.duration,
    model.price ?? null,
    model.createdAt,
  );
}

/** Prisma models array -> Domain entities array */
export function toDomainList(models: PrismaServiceModel[]): ServiceEntity[] {
  return models.map(toDomain);
}

/** Domain entity -> Response (shape compatible con el front actual) */
export function toResponse(entity: ServiceEntity): ServiceResponse {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description ?? undefined,
    duration: entity.duration,
    price: entity.price ?? undefined,
    createdAt: entity.createdAt,
  };
}

/** Domain entities array -> Response array */
export function toResponseList(entities: ServiceEntity[]): ServiceResponse[] {
  return entities.map(toResponse);
}
