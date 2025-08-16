// src/modules/service/service.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module'; // si tu PrismaModule es global, igual puede quedarse
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { ServiceRepository } from './repository';
import { PrismaServiceRepository } from './prisma-service.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceController],
  providers: [
    ServiceService,
    { provide: ServiceRepository, useClass: PrismaServiceRepository },
  ],
  exports: [ServiceService],
})
export class ServiceModule {}
