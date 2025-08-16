// src/modules/client/prisma-client.repository.ts
// Prisma adapter — implements ClientRepository port.

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientRepository, CreateClientInput, UpdateClientInput } from './repository';
import { Client } from './entities/client.entity';
import { toDomain, toDomainList } from './mappers/client.mapper';

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: { q?: string; page?: number; pageSize?: number } = {}): 
    Promise<{ items: Client[]; total: number }> {
    let { q, page = 1, pageSize = 10 } = params;

    // Sanitizar valores
    page = Math.max(1, Number(page) || 1);
    pageSize = Math.min(100, Math.max(1, Number(pageSize) || 10)); // máx 100

    const where = q?.trim()
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'desc' }, // o createdAt si lo prefieres
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      items: toDomainList(items),
      total,
    };
  }

  async findById(id: number): Promise<Client | null> {
    const model = await this.prisma.client.findUnique({ where: { id } });
    return model ? toDomain(model) : null;
  }

  async create(data: CreateClientInput): Promise<Client> {
    const model = await this.prisma.client.create({ data });
    return toDomain(model);
  }

  async update(id: number, data: UpdateClientInput): Promise<Client> {
    const model = await this.prisma.client.update({ where: { id }, data });
    return toDomain(model);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }
}
