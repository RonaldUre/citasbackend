export class ClientResponseDto {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
}