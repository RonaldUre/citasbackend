// src/modules/service/repository.ts
// Port (domain contract) — no NestJS/Prisma dependencies here.

import { ServiceEntity } from './entities/service.entity';

/** Domain-level inputs (decoupled from HTTP DTOs) */
export type CreateServiceInput = {
  name: string;
  description?: string | null;
  /** Duration in minutes */
  duration: number;
  price?: number | null;
};

export type UpdateServiceInput = Partial<{
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
}>;

export abstract class ServiceRepository {
  /** List all (no pagination in current API) */
  abstract findMany(): Promise<ServiceEntity[]>;

  /** Get by id or null if not found */
  abstract findById(id: number): Promise<ServiceEntity | null>;

  /** Create and return persisted entity */
  abstract create(data: CreateServiceInput): Promise<ServiceEntity>;

  /** Update and return updated entity */
  abstract update(id: number, data: UpdateServiceInput): Promise<ServiceEntity>;

  /** Remove (idempotent) */
  abstract remove(id: number): Promise<void>;
}
