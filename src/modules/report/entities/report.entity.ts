// src/modules/report/entities/report.entity.ts
// Domain entity (no Nest/Prisma imports). Mirrors Prisma model fields.

export class ReportEntity {
  constructor(
    public readonly id: number,
    public description: string,
    public isForEventCancel: boolean,
    public hasRecovery: boolean,
    public readonly createdAt: Date,
    // FKs
    public appointmentId: number,
    public createdById: number,
  ) {}
}
