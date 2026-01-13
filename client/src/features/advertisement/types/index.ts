export interface AdCampaign {
  id: string; 
  name: string;
  advertiserId: string;
  status: CampaignStatus;
  viewsPurchased: number;
  uniqueViewsDelivered: number;
  paymentId:string
  cpv: number;
  startDate?: Date;
  endDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AdCreative{
id: string;
  url: string;
  type: string;
  zone: AdZone;
  destinationUrl:string
  format:string
  campaignId:string
}
export interface AdCreativeWithCampaign extends AdCreative{
  campaign:AdCampaign
}

export interface AdZone{
  id:string;
  name:string
  dimensions:string
  description:string
  maxSize:string
  
}
export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
