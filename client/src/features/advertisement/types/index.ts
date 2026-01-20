export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export interface AdCampaign {
  id: string;
  name: string;
  advertiserId: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  targeting: string[];
  viewsDelivered: number;
  uniqueViews: number;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  cpv: number;
  startDate?: Date;
  endDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AdCreative {
  id: string;
  campaignId: string;
  zoneId: string;
  name: string;
  url: string;
  destinationUrl: string;
  type: string;
  format: string;
  dimensions: Record<string, any>;
  views: number;
  numberOfViews: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface AdCreativeWithCampaign extends AdCreative {
  campaign: AdCampaign;
}

export interface AdZone {
  id: string;
  name: string;
  description: string | null;
  pricePerView: number;
  type: AdZoneType;
  dimensions: string;
  maxSize: string;
  tags: string[];
  status: AdZoneStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum AdZoneType {
  BANNER = 'banner',
  SIDEBAR = 'sidebar',
  INTERSTITIAL = 'interstitial',
  NATIVE = 'native'
}

export enum AdZoneStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}
