// src/modules/service/entities/service.entity.ts
// Domain entity (no Nest/Prisma imports). Mirrors Prisma model fields.

export class ServiceEntity {
  constructor(
    public readonly id: number,
    public name: string,
    public description: string | null,
    /** Duration in minutes */
    public duration: number,
    public price: number | null,
    public readonly createdAt: Date,
  ) {}
}
