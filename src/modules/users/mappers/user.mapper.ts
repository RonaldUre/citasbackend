// src/modules/user/mappers/user.mapper.ts
// Handles all mapping between Prisma <-> Domain <-> DTOs

import { User as PrismaUserModel } from '@prisma/client';
import { User, UserRole } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

/** Prisma model -> Domain entity */
export function toDomain(model: PrismaUserModel): User {
  return new User(
    model.id,
    model.name,
    model.email,
    model.password,
    model.role as UserRole,
    model.avatar ?? null,
    model.createdAt,
    model.lastLogin ?? null,
  );
}

/** Prisma models array -> Domain entities array */
export function toDomainList(models: PrismaUserModel[]): User[] {
  return models.map(toDomain);
}

/** Domain entity -> Response DTO (no password) */
export function toResponse(entity: User): UserResponseDto {
  const dto = new UserResponseDto();
  dto.id = entity.id;
  dto.name = entity.name;
  dto.email = entity.email;
  dto.role = entity.role;
  dto.avatar = entity.avatar ?? undefined;
  dto.createdAt = entity.createdAt;
  dto.lastLogin = entity.lastLogin ?? undefined;
  return dto;
}

/** Domain entities array -> Response DTOs array */
export function toResponseList(entities: User[]): UserResponseDto[] {
  return entities.map(toResponse);
}
