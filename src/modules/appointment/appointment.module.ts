// src/modules/appointment/appointment.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentRepository } from './repository';
import { PrismaAppointmentRepository } from './prisma-appointment.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    { provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
  ],
})
export class AppointmentModule {}
