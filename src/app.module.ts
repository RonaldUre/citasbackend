import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { ServiceModule } from './modules/service/service.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    // Global config with .env/.env.production support and strict validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ClientModule,
    ServiceModule,
    AppointmentModule,
    ReportModule,
  ],
})
export class AppModule {}