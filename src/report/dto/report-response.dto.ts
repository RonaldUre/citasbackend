export class ReportResponseDto {
  id: number;
  description: string;
  isForEventCancel: boolean;
  hasRecovery: boolean;
  createdAt: Date;
  appointmentId: number;
  createdBy: {
    id: number;
    name: string;
  };
}