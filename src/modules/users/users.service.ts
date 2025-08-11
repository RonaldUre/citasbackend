import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma, User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as any).code === "P2002"
      ) {
        throw new BadRequestException("El email ya está registrado");
      }

      throw error; // para otros errores desconocidos
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    try {
      const dataToUpdate: Partial<Prisma.UserUpdateInput> = { ...dto };

      if (dto.password) {
        dataToUpdate.password = await bcrypt.hash(dto.password, 10);
      }

      return await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as any).code === "P2002"
      ) {
        throw new BadRequestException("El email ya está registrado");
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.findById(id); // Para lanzar 404 si no existe
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    return user;
  }

  async findByRole(role: string): Promise<User[]> {
    const upperRole = role.toUpperCase();

    if (!Object.values(UserRole).includes(upperRole as UserRole)) {
      throw new BadRequestException("Rol inválido");
    }

    return this.prisma.user.findMany({
      where: { role: upperRole as UserRole },
    });
  }
}
