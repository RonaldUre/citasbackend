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
  exports: [ClientService],
})
export class ClientModule {}
