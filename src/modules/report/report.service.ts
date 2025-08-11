import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReportDto, userId: number) {
    // Validar que la cita exista
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException('Cita asociada no encontrada');
    }

    return this.prisma.report.create({
      data: {
        description: dto.description,
        isForEventCancel: dto.isForEventCancel,
        hasRecovery: dto.hasRecovery,
        appointmentId: dto.appointmentId,
        createdById: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        appointment: { select: { id: true, date: true, status: true } },
      },
    });
    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }
    return report;
  }

  async update(id: number, dto: UpdateReportDto) {
    try {
      return await this.prisma.report.update({
        where: { id },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Reporte no encontrado');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.report.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Reporte no encontrado');
      }
      throw error;
    }
  }
}