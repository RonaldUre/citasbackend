// src/modules/appointment/prisma-appointment.repository.ts
// Prisma adapter — implements AppointmentRepository port.

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AppointmentRepository,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  FindManyParams,
} from './repository';
import { AppointmentStatus } from './entities/appointment.entity';
import {
  toResponseFromPrisma,
  toResponseListFromPrisma,
  PrismaAppointmentWithIncludes,
} from './mappers/appointment.mapper';

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: FindManyParams = {}): Promise<{ items: ReturnType<typeof toResponseListFromPrisma>; total: number }> {
    let { page = 1, pageSize = 10, userId, clientId, status, from, to } = params;

    page = Math.max(1, Number(page) || 1);
    pageSize = Math.min(100, Math.max(1, Number(pageSize) || 10));

    const where: any = {};
    if (userId) where.userId = userId;
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { date: 'asc' },
        include: {
          client: { select: { id: true, name: true } },
          user:   { select: { id: true, name: true } },
          service:{ select: { id: true, name: true } },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    const items = toResponseListFromPrisma(rows as PrismaAppointmentWithIncludes[]);
    return { items, total };
  }

  async findByIdWithRelations(id: number) {
    const model = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } },
        user:   { select: { id: true, name: true } },
        service:{ select: { id: true, name: true } },
      },
    });
    return model ? toResponseFromPrisma(model as PrismaAppointmentWithIncludes) : null;
  }

  async create(data: CreateAppointmentInput) {
    const model = await this.prisma.appointment.create({
      data: {
        date: data.date,
        status: data.status ?? AppointmentStatus.PENDING, // default compatible
        tag: data.tag ?? null,
        isRecurring: data.isRecurring ?? false,
        userId: data.userId,
        clientId: data.clientId,
        serviceId: data.serviceId ?? null,
      },
      include: {
        client: { select: { id: true, name: true } },
        user:   { select: { id: true, name: true } },
        service:{ select: { id: true, name: true } },
      },
    });
    return toResponseFromPrisma(model as PrismaAppointmentWithIncludes);
  }

  async update(id: number, data: UpdateAppointmentInput) {
    const model = await this.prisma.appointment.update({
      where: { id },
      data: {
        date: data.date ?? undefined,
        status: data.status ?? undefined,
        tag: data.tag ?? undefined,
        isRecurring: data.isRecurring ?? undefined,
        userId: data.userId ?? undefined,
        clientId: data.clientId ?? undefined,
        serviceId: data.serviceId ?? undefined,
      },
      include: {
        client: { select: { id: true, name: true } },
        user:   { select: { id: true, name: true } },
        service:{ select: { id: true, name: true } },
      },
    });
    return toResponseFromPrisma(model as PrismaAppointmentWithIncludes);
  }

  async updateStatus(id: number, status: AppointmentStatus) {
    const model = await this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        client: { select: { id: true, name: true } },
        user:   { select: { id: true, name: true } },
        service:{ select: { id: true, name: true } },
      },
    });
    return toResponseFromPrisma(model as PrismaAppointmentWithIncludes);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.appointment.delete({ where: { id } });
  }
}
