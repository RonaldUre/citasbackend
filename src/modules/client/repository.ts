// src/modules/client/repository.ts
// Port (domain contract) — no NestJS/Prisma dependencies here.

import { Client } from './entities/client.entity';

/** Domain-level inputs (decoupled from HTTP DTOs) */
export type CreateClientInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

export type UpdateClientInput = Partial<CreateClientInput>;

export abstract class ClientRepository {
  /** List with optional search & pagination */
  abstract findMany(params?: {
    q?: string;
    page?: number;      // 1-based
    pageSize?: number;  // items per page
  }): Promise<{ items: Client[]; total: number }>;

  /** Get by id or null if not found */
  abstract findById(id: number): Promise<Client | null>;

  /** Create a new client and return the persisted entity */
  abstract create(data: CreateClientInput): Promise<Client>;

  /** Update an existing client and return the updated entity */
  abstract update(id: number, data: UpdateClientInput): Promise<Client>;

  /** Remove a client (idempotent) */
  abstract remove(id: number): Promise<void>;
}
