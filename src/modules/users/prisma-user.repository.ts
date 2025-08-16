import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Prisma,
  User as PrismaUserModel,
  UserRole as PrismaUserRole, // 👈 runtime enum (no Prisma.UserRole)
} from '@prisma/client';
import {
  UserRepository,
  CreateUserInput,
  UpdateUserInput,
} from './repository';
import { User, UserRole } from './entities/user.entity';
import { toDomain, toDomainList } from './mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<User[]> {
    const models = await this.prisma.user.findMany({
      orderBy: { id: 'desc' },
    });
    return toDomainList(models as PrismaUserModel[]);
  }

  async findById(id: number): Promise<User | null> {
    const model = await this.prisma.user.findUnique({ where: { id } });
    return model ? toDomain(model as PrismaUserModel) : null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const model = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // ya hasheado desde el servicio
        role: data.role as unknown as PrismaUserRole, // 👈 usar runtime enum
        avatar: data.avatar ?? null,
        lastLogin: data.lastLogin ?? null,
      },
    });
    return toDomain(model as PrismaUserModel);
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    const model = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: (data.role as unknown as PrismaUserRole | undefined), // 👈
        avatar: data.avatar ?? undefined,
        lastLogin: data.lastLogin ?? undefined,
      },
    });
    return toDomain(model as PrismaUserModel);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.prisma.user.findUnique({ where: { email } });
    return model ? toDomain(model as PrismaUserModel) : null;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const models = await this.prisma.user.findMany({
      where: { role: role as unknown as PrismaUserRole }, // 👈
      orderBy: { id: 'desc' },
    });
    return toDomainList(models as PrismaUserModel[]);
  }
}
