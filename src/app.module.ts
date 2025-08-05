import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { ServiceModule } from './service/service.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ClientModule, ServiceModule, AppointmentModule, ReportModule],
})
export class AppModule {}