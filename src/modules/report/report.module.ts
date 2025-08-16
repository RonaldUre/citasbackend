import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

import { ReportRepository } from './repository';
import { PrismaReportRepository } from './prisma-report.repository';

import { AppointmentModule } from '../../modules/appointment/appointment.module';
import { AppointmentRepository } from '../../modules/appointment/repository';
import { PrismaAppointmentRepository } from '../../modules/appointment/prisma-appointment.repository';

@Module({
  imports: [
    PrismaModule,
    AppointmentModule, // para inyectar AppointmentRepository en el servicio
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    { provide: ReportRepository, useClass: PrismaReportRepository },
    // En caso de que AppointmentModule NO exporte el provider del repositorio,
    // puedes exponerlo aquí también. Si AppointmentModule ya lo exporta,
    // esta línea no es necesaria.
    { provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
  ],
  exports: [ReportService],
})
export class ReportModule {}
