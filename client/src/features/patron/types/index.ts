
export interface PatronSubscriptionPackage {
  id: string;
  patronId: string;
  tier: PatronTier;
  frequency: SubscriptionFrequency;
  miniumumAmount: number;
  benefits: string[]
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum PatronTier {
  SPONSOR_GRAND_PATRON = 'sponsor_grand_patron',
  PATRON = 'patron',
  SUPPORTER = 'supporter',
}

export enum SubscriptionFrequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAYMENT_FAILED = 'payment_failed'
}

export interface Patron {
  id: string;
  name: string;
  email: string;
  phoneNumber: string
  imageUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface PatronWithSubscription extends Patron {
  subscription: PatronSubscriptionPackage
}

export type SupporterWithTier = PatronWithSubscription;