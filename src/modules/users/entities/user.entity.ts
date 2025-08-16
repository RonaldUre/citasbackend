// src/modules/user/entities/user.entity.ts

// Domain enum mirrors Prisma's enum.
// Keep it decoupled from Prisma by redefining it here.
export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSIONAL = 'PROFESSIONAL',
}

export class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public password: string,      // Will not be exposed in responses (mapper/DTO handles that)
    public role: UserRole,
    public avatar: string | null, // Optional URL
    public readonly createdAt: Date,
    public lastLogin: Date | null,
  ) {}
}
