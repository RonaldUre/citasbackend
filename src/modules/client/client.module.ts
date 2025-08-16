// src/modules/client/client.module.ts
import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './repository';
import { PrismaClientRepository } from './prisma-client.repository';


@Module({

  controllers: [ClientController],
  providers: [
    ClientService,
    { provide: ClientRepository, useClass: PrismaClientRepository },
  ],
  exports: [
    ClientService,
    // Exporta el puerto si otro módulo lo necesita
    { provide: ClientRepository, useClass: PrismaClientRepository },
  ],
})
export class ClientModule {}
