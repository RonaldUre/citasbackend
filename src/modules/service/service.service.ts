// src/modules/service/service.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

import {
  ServiceRepository,
  CreateServiceInput,
  UpdateServiceInput,
} from './repository';

import { toResponse, toResponseList } from './mappers/service.mapper';

@Injectable()
export class ServiceService {
  constructor(private readonly repo: ServiceRepository) {}

  async create(dto: CreateServiceDto) {
    const input: CreateServiceInput = {
      name: dto.name,
      description: dto.description ?? null,
      duration: dto.duration,
      price: dto.price ?? null,
    };
    const entity = await this.repo.create(input);
    return toResponse(entity); // ⬅️ mantiene el shape actual
  }

  async findAll() {
    const entities = await this.repo.findMany();
    return toResponseList(entities); // ⬅️ mismo shape que antes
  }

  async findOne(id: number) {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundException('Servicio no encontrado');
    return toResponse(entity);
  }

  async update(id: number, dto: UpdateServiceDto) {
    const input: UpdateServiceInput = {
      name: dto.name ?? undefined,
      description: (dto.description ?? undefined) as string | null | undefined,
      duration: dto.duration ?? undefined,
      price: (dto.price ?? undefined) as number | null | undefined,
    };

    try {
      const entity = await this.repo.update(id, input);
      return toResponse(entity);
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Servicio no encontrado');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.repo.remove(id);
      // controller ya devuelve 204 sin body
      return;
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Servicio no encontrado');
      }
      throw error;
    }
  }
}
