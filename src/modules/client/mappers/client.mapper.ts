import { Client as PrismaClient } from '@prisma/client';
import { Client } from '../entities/client.entity';
import { ClientResponseDto } from '../dto/client-response.dto';

export const toDomain = (model: PrismaClient): Client => {
  return new Client({
    id: model.id,
    name: model.name,
    email: model.email,
    phone: model.phone,
    notes: model.notes,
    createdAt: model.createdAt,
  });
};

export const toResponse = (entity: Client): ClientResponseDto => {
  const dto = new ClientResponseDto();
  dto.id = entity.id;
  dto.name = entity.name;
  dto.email = entity.email;
  dto.phone = entity.phone;
  dto.notes = entity.notes;
  dto.createdAt = entity.createdAt;
  return dto;
};
