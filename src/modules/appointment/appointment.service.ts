// src/modules/appointment/appointment.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import {
  AppointmentRepository,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from './repository';

import {
  AppointmentStatus as DomainAppointmentStatus,
} from './entities/appointment.entity';

// Para compat con el controller, que usa el enum de Prisma en la firma
import {
  AppointmentStatus as PrismaAppointmentStatus,
} from '@prisma/client';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  // 👇 Shim temporal a Prisma SOLO para validaciones de existencia (user/client/service)
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: AppointmentRepository,
  ) {}

  /** POST /appointments */
  async create(dto: CreateAppointmentDto) {
    // --- Validaciones de existencia (mantiene comportamiento actual) ---
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Profesional no encontrado');

    const client = await this.prisma.client.findUnique({ where: { id: dto.clientId } });
    if (!client) throw new NotFoundException('Cliente no encontrado');

    if (dto.serviceId) {
      const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
      if (!service) throw new NotFoundException('Servicio no encontrado');
    }

    // --- Persistencia vía puerto ---
    const input: CreateAppointmentInput = {
      date: new Date(dto.date),
      status: (dto.status ?? DomainAppointmentStatus.PENDING) as DomainAppointmentStatus,
      tag: dto.tag ?? null,
      isRecurring: dto.isRecurring ?? false,
      userId: dto.userId,
      clientId: dto.clientId,
      serviceId: dto.serviceId ?? null,
    };

    return this.repo.create(input); // incluye user/client/service {id,name} en la respuesta
  }

  /** GET /appointments */
  async findAll(params: {
    page?: number;
    limit?: number;
    userId?: number;
    clientId?: number;
    status?: PrismaAppointmentStatus;
    from?: string;
    to?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      userId,
      clientId,
      status,
      from,
      to,
    } = params;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const { items, total } = await this.repo.findMany({
      page,
      pageSize: limit, // 👈 mapeo limit -> pageSize
      userId,
      clientId,
      status: (status as unknown as DomainAppointmentStatus) ?? undefined,
      from: fromDate,
      to: toDate,
    });

    return {
      data: items, // ya viene con user/client/service {id,name}
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** GET /appointments/:id */
  async findOne(id: number) {
    const appt = await this.repo.findByIdWithRelations(id);
    if (!appt) throw new NotFoundException('Cita no encontrada');
    return appt; // mantiene include { user, client, service }
  }

  /** PUT /appointments/:id */
  async update(id: number, dto: UpdateAppointmentDto) {
    // --- Validaciones de existencia condicionales (mantiene comportamiento actual) ---
    if (dto.userId !== undefined) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('Profesional no encontrado');
    }
    if (dto.clientId !== undefined) {
      const client = await this.prisma.client.findUnique({ where: { id: dto.clientId } });
      if (!client) throw new NotFoundException('Cliente no encontrado');
    }
    if (dto.serviceId !== undefined) {
      const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
      if (!service) throw new NotFoundException('Servicio no encontrado');
    }

    const input: UpdateAppointmentInput = {
      date: dto.date ? new Date(dto.date) : undefined,
      status: (dto.status as unknown as DomainAppointmentStatus) ?? undefined,
      tag: dto.tag ?? undefined,
      isRecurring: dto.isRecurring ?? undefined,
      userId: dto.userId ?? undefined,
      clientId: dto.clientId ?? undefined,
      serviceId: dto.serviceId ?? undefined,
    };

    try {
      return await this.repo.update(id, input); // respuesta con relaciones
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Cita no encontrada');
      }
      throw error;
    }
  }

  /** PATCH /appointments/:id/status */
  async updateStatus(id: number, status: PrismaAppointmentStatus) {
    // casteo a enum de dominio (valores string idénticos)
    return this.repo.updateStatus(id, status as unknown as DomainAppointmentStatus);
  }

  /** DELETE /appointments/:id */
  async remove(id: number): Promise<void> {
    try {
      await this.repo.remove(id);
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Cita no encontrada');
      }
      throw error;
    }
  }
}
