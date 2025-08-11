import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    try {
      return await this.prisma.client.create({ data: dto });
    } catch (error) {
      if (error.code === "P2002") {
        // Email duplicado (si existe)
        throw new ConflictException("Ya existe un cliente con este email.");
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.client.count(),
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

  async findAllWithoutPagination() {
    return this.prisma.client.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException("Cliente no encontrado");
    return client;
  }

  async update(id: number, dto: UpdateClientDto) {
    try {
      return await this.prisma.client.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Cliente no encontrado");
      }
      if (error.code === "P2002") {
        throw new ConflictException("Ya existe otro cliente con ese email.");
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.client.delete({ where: { id } });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Cliente no encontrado");
      }
      throw error;
    }
  }

  async findAppointments(clientId: number) {
    // Confirmar que el cliente exista
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) throw new NotFoundException("Cliente no encontrado");

    return this.prisma.appointment.findMany({
      where: { clientId },
      orderBy: { date: "desc" },
       include: {
      service: { select: { name: true } }, // ✅ incluimos el nombre del servicio
      user: { select: { name: true } },     // ✅ incluimos el nombre del profesional
    },
    });
  }
}
