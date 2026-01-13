export interface DonationAttributes {
  id: string;
  amount: number;
  currency: string;
  donorId?: string;
  donorEmail: string;
  donorFirstName: string;
  donorLastName: string;
  donorPhone?: string;
  message?: string;
  status: DonationStatus;
  paymentReference: string;
  paystackReference: string;
  optInSupporterWall: boolean;
  anonymous: boolean;
  metadata: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}