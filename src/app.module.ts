import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { ServiceModule } from './modules/service/service.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ClientModule, ServiceModule, AppointmentModule, ReportModule],
})
export class AppModule {} 