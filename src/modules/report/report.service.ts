import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";

import {
  ReportRepository,
  CreateReportInput,
  UpdateReportInput,
} from "./repository";

import { AppointmentRepository } from "../../modules/appointment/repository"; // para validar existencia

@Injectable()
export class ReportService {
  constructor(
    private readonly reports: ReportRepository,
    private readonly appointments: AppointmentRepository // validar cita existente
  ) {}

  /** POST /reports */
  async create(dto: CreateReportDto, userId: number) {
    // Validar que la cita exista (mantiene comportamiento actual)
    const appt = await this.appointments.findByIdWithRelations(
      dto.appointmentId
    );
    if (!appt) throw new NotFoundException("Cita asociada no encontrada");

    const input: CreateReportInput = {
      description: dto.description,
      isForEventCancel: dto.isForEventCancel ?? false,
      hasRecovery: dto.hasRecovery ?? false,
      appointmentId: dto.appointmentId,
      createdById: userId, // desde el request (controller)
    };

    return this.reports.create(input); // respuesta básica (sin includes)
  }

  /** GET /reports */
  findAll() {
    // lista básica (sin includes), mismo shape que hoy
    return this.reports.findMany();
  }

  /** GET /reports/:id */
  async findOne(id: number) {
    const report = await this.reports.findByIdWithRelations(id);
    if (!report) throw new NotFoundException("Reporte no encontrado");
    return report; // detalle con createdBy y appointment
  }

  /** PUT /reports/:id */
  async update(id: number, dto: UpdateReportDto) {
    const input: UpdateReportInput = {
      description: dto.description ?? undefined,
      isForEventCancel: dto.isForEventCancel ?? undefined,
      hasRecovery: dto.hasRecovery ?? undefined,
      appointmentId: dto.appointmentId ?? undefined,
      createdById: dto.createdById ?? undefined,
    };

    try {
      return await this.reports.update(id, input); // respuesta básica
    } catch (error: any) {
      if (error?.code === "P2025") {
        throw new NotFoundException("Reporte no encontrado");
      }
      throw error;
    }
  }

  /** DELETE /reports/:id */
  async remove(id: number): Promise<void> {
    try {
      await this.reports.remove(id);
    } catch (error: any) {
      if (error?.code === "P2025") {
        throw new NotFoundException("Reporte no encontrado");
      }
      throw error;
    }
  }

  /** GET /reports/exists?appointmentIds=... */
  async existsByAppointmentIds(
    appointmentIds: number[]
  ): Promise<Record<number, boolean>> {
    const counts = await this.reports.countByAppointmentIds(appointmentIds);
    const result: Record<number, boolean> = {};
    // Inicializar en false todos los IDs solicitados
    for (const id of appointmentIds) {
      result[id] = false;
    }
    // Marcar true donde haya conteo > 0
    for (const c of counts) {
      result[c.appointmentId] = (c._count ?? 0) > 0;
    }
    return result;
  }

  /** GET /reports/by-appointment/:appointmentId/latest */
  async findLatestByAppointment(appointmentId: number) {
    return this.reports.findLatestByAppointmentId(appointmentId);
  }
}
