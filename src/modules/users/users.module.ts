import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // si está en el mismo módulo
import { UserRepository } from './repository';
import { PrismaUserRepository } from './prisma-user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}