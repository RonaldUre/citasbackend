// src/modules/client/mappers/client.mapper.ts
// Handles all mapping between Prisma <-> Domain <-> DTOs

import { Client as PrismaClientModel } from '@prisma/client';
import { Client } from '../entities/client.entity';
import { ClientResponseDto } from '../dto/client-response.dto';

/** Prisma model -> Domain entity */
export function toDomain(model: PrismaClientModel): Client {
  return new Client({
    id: model.id,
    name: model.name,
    email: model.email,
    phone: model.phone,
    notes: model.notes,
    createdAt: model.createdAt,
  });
}

/** Prisma models array -> Domain entities array */
export function toDomainList(models: PrismaClientModel[]): Client[] {
  return models.map(toDomain);
}

/** Domain entity -> Response DTO */
export function toResponse(entity: Client): ClientResponseDto {
  const dto = new ClientResponseDto();
  dto.id = entity.id!;
  dto.name = entity.name;
  dto.email = entity.email ?? undefined;
  dto.phone = entity.phone ?? undefined;
  dto.notes = entity.notes ?? undefined;
  dto.createdAt = entity.createdAt;
  return dto;
}

/** Domain entities array -> Response DTOs array */
export function toResponseList(entities: Client[]): ClientResponseDto[] {
  return entities.map(toResponse);
}
