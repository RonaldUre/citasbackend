export class Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: Date;

  constructor(data: Partial<Client>) {
    Object.assign(this, data);

    if (!this.name) {
      throw new Error('Client name is required');
    }
  }
}
