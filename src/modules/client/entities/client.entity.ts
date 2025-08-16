// src/modules/client/entities/client.entity.ts
// Domain entity: no NestJS/Prisma imports

export class Client {
  readonly id?: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  readonly createdAt: Date;

  constructor(data: {
    id?: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    createdAt?: Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email ?? null;
    this.phone = data.phone ?? null;
    this.notes = data.notes ?? null;
    this.createdAt = data.createdAt ?? new Date();
  }
}
