// src/modules/user/repository.ts
// Port (domain contract) — no NestJS/Prisma dependencies here.

import { User, UserRole } from './entities/user.entity';

/** Domain-level inputs (decoupled from HTTP DTOs) */
export type CreateUserInput = {
  name: string;
  email: string;
  /** Hashed password (hashing ocurre en el servicio) */
  password: string;
  role: UserRole;
  avatar?: string | null;
  /** Permite setear/actualizar lastLogin desde casos de uso específicos */
  lastLogin?: Date | null;
};

export type UpdateUserInput = Partial<{
  name: string;
  email: string;
  /** Hashed password (si se envía, ya viene hasheado desde el servicio) */
  password: string;
  role: UserRole;
  avatar: string | null;
  lastLogin: Date | null;
}>;

/** Repositorio de dominio para User */
export abstract class UserRepository {
  /** Lista completa (sin paginar) para mantener compat con tu endpoint actual `GET /users` */
  abstract findMany(): Promise<User[]>;

  /** Get por id (o null si no existe) */
  abstract findById(id: number): Promise<User | null>;

  /** Create y devuelve la entidad persistida */
  abstract create(data: CreateUserInput): Promise<User>;

  /** Update y devuelve la entidad actualizada */
  abstract update(id: number, data: UpdateUserInput): Promise<User>;

  /** Delete idempotente */
  abstract remove(id: number): Promise<void>;

  /** Look-up por email (para auth) */
  abstract findByEmail(email: string): Promise<User | null>;

  /** Filtrado por rol */
  abstract findByRole(role: UserRole): Promise<User[]>;
}
