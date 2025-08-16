import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserRepository, CreateUserInput, UpdateUserInput } from './repository';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UserRepository) {}

  // Mantiene compat con tu controller: lista completa sin paginación
  findAll(): Promise<User[]> {
    return this.repo.findMany();
  }

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const input: CreateUserInput = {
      name: data.name,
      email: data.email,
      password: hashedPassword, // hashing en servicio
      role: data.role as unknown as UserRole, // enum dominio
      avatar: data.avatar ?? null,
      lastLogin: null,
    };

    try {
      return await this.repo.create(input);
    } catch (error: unknown) {
      // Prisma unique violation
      if (typeof error === 'object' && error && 'code' in error && (error as any).code === 'P2002') {
        throw new BadRequestException('El email ya está registrado');
      }
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const dataToUpdate: UpdateUserInput = {
      name: dto.name,
      email: dto.email,
      role: (dto.role as unknown as UserRole) ?? undefined,
      avatar: dto.avatar ?? undefined,
    };

    if (dto.password) {
      dataToUpdate.password = await bcrypt.hash(dto.password, 10);
    }

    try {
      return await this.repo.update(id, dataToUpdate);
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'code' in error && (error as any).code === 'P2002') {
        throw new BadRequestException('El email ya está registrado');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    // Conserva el 404 si no existe
    await this.findById(id);
    await this.repo.remove(id);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async findByRole(role: string): Promise<User[]> {
    const upperRole = role.toUpperCase();
    if (!Object.values(UserRole).includes(upperRole as UserRole)) {
      throw new BadRequestException('Rol inválido');
    }
    return this.repo.findByRole(upperRole as UserRole);
  }
}
