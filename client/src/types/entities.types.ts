export interface AdCampaignAttributes {
  id: string;
  name: string;
  advertiserId: string;
  zone: AdZone;
  status: CampaignStatus;
  budget: number;
  spent: number;
  viewsPurchased: number;
  viewsDelivered: number;
  uniqueViews: number;
  creativeId: string;
  creativeUrl: string;
  creativeType: string;
  creativeFormat: string;
  creativeDimensions: any;
  targeting: any;
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


export interface ArticleAttributes {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags: ArticleTag[];
  authorId: string;
  viewCount: number;
  readTime: number;
  videoEmbedUrl?: string;
  videoProvider?: string;
  status: ArticleStatus;
  scheduledPublishAt?: Date;
  publishedAt?: Date;
  adZones: any[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}  

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
export interface PlayerAttributes {
  id: string;
  name: string;
  dateOfBirth: Date;
  position: PlayerPosition;
  height?: number;
  nationality?: string;
  biography?: string;
  squadNumber?: number;
  imageUrl?: string;
  status: PlayerStatus;
  joinedDate?: Date;
  previousClubs: string[];
  contactEmail?: string;
  contactPhone?: string;
  agentName?: string;
  agentContact?: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  metadata: Record<string, any>;
  createdById: string;
  updatedById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}