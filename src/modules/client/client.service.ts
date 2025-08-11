import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from './repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async list(q?: string, page?: number, pageSize?: number) {
    return this.clientRepository.findMany({ q, page, pageSize });
  }

  async get(id: number) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async create(dto: CreateClientDto) {
    return this.clientRepository.create(dto);
  }

  async update(id: number, dto: UpdateClientDto) {
    await this.get(id); // Ensure client exists
    return this.clientRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.get(id); // Ensure client exists
    await this.clientRepository.remove(id);
  }
}
