import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentStatus } from "@prisma/client";

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    // Validar que user exista
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException("Profesional no encontrado");

    // Validar que client exista
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });
    if (!client) throw new NotFoundException("Cliente no encontrado");

    // Validar que service exista (si se envió)
    if (dto.serviceId) {
      const service = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
      });
      if (!service) throw new NotFoundException("Servicio no encontrado");
    }

    return this.prisma.appointment.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    userId?: number;
    clientId?: number;
    status?: AppointmentStatus;
    from?: string;
    to?: string;
  }) {
    const { page = 1, limit = 10, userId, clientId, status, from, to } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) where.userId = userId;
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "asc" },
        include: {
          client: {
            select: { id: true, name: true },
          },
          user: {
            select: { id: true, name: true },
          },
          service: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });

    if (!appointment) throw new NotFoundException("Cita no encontrada");
    return appointment;
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    if (dto.userId !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });
      if (!user) throw new NotFoundException("Profesional no encontrado");
    }

    if (dto.clientId !== undefined) {
      const client = await this.prisma.client.findUnique({
        where: { id: dto.clientId },
      });
      if (!client) throw new NotFoundException("Cliente no encontrado");
    }

    if (dto.serviceId !== undefined) {
      const service = await this.prisma.service.findUnique({
        where: { id: dto.serviceId },
      });
      if (!service) throw new NotFoundException("Servicio no encontrado");
    }
    try {
      return await this.prisma.appointment.update({
        where: { id },
        data: {
          ...dto,
          date: dto.date ? new Date(dto.date) : undefined,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Cita no encontrada");
      }
      throw error;
    }
  }

  async updateStatus(id: number, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.appointment.delete({ where: { id } });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Cita no encontrada");
      }
      throw error;
    }
  }
}
