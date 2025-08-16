// src/modules/appointment/entities/appointment.entity.ts

// Domain enum mirrors Prisma's AppointmentStatus.
// Kept decoupled from Prisma client imports.
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class Appointment {
  constructor(
    public readonly id: number,
    public date: Date,
    public status: AppointmentStatus,
    public tag: string | null,
    public isRecurring: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    // Relations (FKs only in the domain entity)
    public userId: number,
    public clientId: number,
    public serviceId: number | null,
  ) {}
}
