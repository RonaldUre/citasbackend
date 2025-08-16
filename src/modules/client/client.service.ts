// src/modules/client/client.service.ts
// Application layer: orchestrates use-cases, no Prisma/Nest specifics.

import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ClientRepository,
  CreateClientInput,
  UpdateClientInput,
} from "./repository";
import { Client } from "./entities/client.entity";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepository,
    private readonly prisma: PrismaService
  ) {}

  async list(
    q?: string,
    page?: number,
    pageSize?: number
  ): Promise<{ items: Client[]; total: number }> {
    return this.clientRepo.findMany({ q, page, pageSize });
  }

  async get(id: number): Promise<Client> {
    const client = await this.clientRepo.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return client;
  }

  async create(data: CreateClientInput): Promise<Client> {
    return this.clientRepo.create(data);
  }

  async update(id: number, data: UpdateClientInput): Promise<Client> {
    await this.ensureExists(id);
    return this.clientRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.clientRepo.remove(id);
  }

  /** Helper to validate existence */
  private async ensureExists(id: number): Promise<void> {
    const exists = await this.clientRepo.findById(id);
    if (!exists) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }

    // === COMPAT EXACTA con tu versión anterior ===
  async findAppointments(clientId: number) {
    // Confirmar que el cliente exista
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Cliente no encontrado');

    return this.prisma.appointment.findMany({
      where: { clientId },
      orderBy: { date: 'desc' },
      include: {
        service: { select: { name: true } }, // <- necesario para ClientHistoryModal.tsx
        user:    { select: { name: true } }, // <- necesario para ClientHistoryModal.tsx
      },
    });
  }
}
