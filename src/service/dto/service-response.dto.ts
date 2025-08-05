export class ServiceResponseDto {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price?: number;
  createdAt: Date;
}