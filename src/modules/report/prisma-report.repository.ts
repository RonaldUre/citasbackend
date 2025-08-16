// src/modules/report/prisma-report.repository.ts
// Prisma adapter — implements ReportRepository port.

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  toResponse,
  toResponseList,
  toDetailResponseFromPrisma,
  PrismaReportWithIncludes,
} from "./mappers/report.mapper";
import {
  ReportRepository,
  CreateReportInput,
  UpdateReportInput,
} from "./repository";

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    const rows = await this.prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
    return toResponseList(rows);
  }

  async findByIdWithRelations(id: number) {
    const model = await this.prisma.report.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        appointment: { select: { id: true, date: true, status: true } },
      },
    });
    return model
      ? toDetailResponseFromPrisma(model as PrismaReportWithIncludes)
      : null;
  }

  async findLatestByAppointmentId(appointmentId: number) {
    const model = await this.prisma.report.findFirst({
      where: { appointmentId },
      include: {
        createdBy: { select: { id: true, name: true } },
        appointment: { select: { id: true, date: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return model
      ? toDetailResponseFromPrisma(model as PrismaReportWithIncludes)
      : null;
  }

  async create(data: CreateReportInput) {
    const model = await this.prisma.report.create({
      data: {
        description: data.description,
        isForEventCancel: data.isForEventCancel ?? false,
        hasRecovery: data.hasRecovery ?? false,
        appointmentId: data.appointmentId,
        createdById: data.createdById,
      },
    });
    return toResponse(model);
  }

  async update(id: number, data: UpdateReportInput) {
    const model = await this.prisma.report.update({
      where: { id },
      data: {
        description: data.description ?? undefined,
        isForEventCancel: data.isForEventCancel ?? undefined,
        hasRecovery: data.hasRecovery ?? undefined,
        appointmentId: data.appointmentId ?? undefined,
        createdById: data.createdById ?? undefined,
      },
    });
    return toResponse(model);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.report.delete({ where: { id } });
  }

  async countByAppointmentIds(
    appointmentIds: number[]
  ): Promise<Array<{ appointmentId: number; _count: number }>> {
    if (!appointmentIds?.length) return [];
    const rows = await this.prisma.report.groupBy({
      by: ["appointmentId"],
      where: { appointmentId: { in: appointmentIds } },
      _count: { _all: true },
    });
    return rows.map((r) => ({
      appointmentId: r.appointmentId,
      _count: (r as any)._count._all as number,
    }));
  }
}
