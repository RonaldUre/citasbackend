import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';

export abstract class ClientRepository {
  abstract findMany(params?: { q?: string; page?: number; pageSize?: number }):
    Promise<{ items: Client[]; total: number }>;
  abstract findById(id: number): Promise<Client | null>;
  abstract create(data: CreateClientDto): Promise<Client>;
  abstract update(id: number, data: Partial<CreateClientDto>): Promise<Client>;
  abstract remove(id: number): Promise<void>;
}
