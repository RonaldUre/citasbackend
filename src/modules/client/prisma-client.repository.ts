import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ClientRepository } from './repository';
import { Client } from './entities/client.entity';
import { toDomain } from './mappers/client.mapper';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: { q?: string; page?: number; pageSize?: number } = {}): Promise<{ items: Client[]; total: number }> {
    const { q, page = 1, pageSize = 10 } = params;
    const where = q ? {
      OR: [
        { name: { contains: q } },
        { email: { contains: q } },
      ],
    } : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      items: items.map(toDomain),
      total,
    };
  }

  async findById(id: number): Promise<Client | null> {
    const model = await this.prisma.client.findUnique({ where: { id } });
    return model ? toDomain(model) : null;
  }

  async create(data: CreateClientDto): Promise<Client> {
    const model = await this.prisma.client.create({ data });
    return toDomain(model);
  }

  async update(id: number, data: Partial<CreateClientDto>): Promise<Client> {
    const model = await this.prisma.client.update({ where: { id }, data });
    return toDomain(model);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }
}
