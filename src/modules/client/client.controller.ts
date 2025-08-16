// src/modules/client/client.controller.ts
// Compatibilidad 100% con el API anterior (mismos endpoints, guards, roles y shapes)

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { toResponse, toResponseList } from './mappers/client.mapper';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN) // Igual que antes: aplica a todo el controlador
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() dto: CreateClientDto) {
    // Mapeo DTO -> input de dominio (normalizamos nullables)
    const input = {
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      notes: dto.notes ?? null,
    };
    const created = await this.clientService.create(input);
    // Salida igual que antes: devolvemos el recurso creado (DTO)
    return toResponse(created);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    // Compat: el front usa "limit", no "pageSize"
    const { items, total } = await this.clientService.list(undefined, page, limit);

    // COMPAT EXACTA: devolver { data, meta: { page, pageSize: limit, total, totalPages } }
    return {
      data: toResponseList(items),
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / Math.max(1, limit))),
      },
    };
  }

  @Get('all')
  async findAllWithoutPagination() {
    // Compat: el endpoint anterior devolvía todos los clients (array simple)
    // Usamos page=1 y limit grande para no cambiar el repositorio
    const { items } = await this.clientService.list(undefined, 1, 10_000);
    return toResponseList(items);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const entity = await this.clientService.get(id);
    return toResponse(entity);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClientDto) {
    const input = {
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      notes: dto.notes ?? null,
    };
    const updated = await this.clientService.update(id, input);
    return toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.clientService.remove(id);
    // Compat estricta: 204 sin body
    return;
  }

  // Mantén este endpoint tal como estaba, con guards específicos:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL)
  @Get(':id/appointments')
  findAppointments(@Param('id', ParseIntPipe) id: number) {
    // Llama al método original del service si lo tienes;
    // si luego lo migramos, haremos un wrapper que use el repositorio de appointments.
    return this.clientService.findAppointments(id);
  }
}