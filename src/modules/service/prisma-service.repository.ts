// src/modules/service/prisma-service.repository.ts
// Prisma adapter — implements ServiceRepository port.

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Service as PrismaServiceModel } from '@prisma/client';
import {
  ServiceRepository,
  CreateServiceInput,
  UpdateServiceInput,
} from './repository';
import { ServiceEntity } from './entities/service.entity';
import { toDomain, toDomainList } from './mappers/service.mapper';

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<ServiceEntity[]> {
    const models = await this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' }, // mantiene tu comportamiento actual
    });
    return toDomainList(models as PrismaServiceModel[]);
  }

  async findById(id: number): Promise<ServiceEntity | null> {
    const model = await this.prisma.service.findUnique({ where: { id } });
    return model ? toDomain(model as PrismaServiceModel) : null;
  }

  async create(data: CreateServiceInput): Promise<ServiceEntity> {
    const model = await this.prisma.service.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        duration: data.duration,
        price: data.price ?? null,
      },
    });
    return toDomain(model as PrismaServiceModel);
  }

  async update(id: number, data: UpdateServiceInput): Promise<ServiceEntity> {
    const model = await this.prisma.service.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        duration: data.duration ?? undefined,
        price: data.price ?? undefined,
      },
    });
    return toDomain(model as PrismaServiceModel);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.service.delete({ where: { id } });
  }
}
