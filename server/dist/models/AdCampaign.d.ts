import { Model, Optional } from 'sequelize';
export declare enum AdZone {
    HOMEPAGE_BANNER = "homepage_banner",
    TOP_PAGE_BANNER = "top_page_banner",
    SIDEBAR = "sidebar",
    ARTICLE_FOOTER = "article_footer",
    MID_ARTICLE = "mid_article"
}
export declare enum CampaignStatus {
    DRAFT = "draft",
    PENDING_PAYMENT = "pending_payment",
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    REFUNDED = "refunded",
    FAILED = "failed"
}
export interface AdCampaignAttributes {
    id: string;
    name: string;
    advertiserId: string;
    status: CampaignStatus;
    budget: number;
    spent: number;
    targeting: string[];
    viewsDelivered: number;
    currentClicks: number;
    uniqueViews: number;
    targetViews: number;
    paymentStatus: PaymentStatus;
    cpv: number;
    startDate?: Date;
    endDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface AdCampaignCreationAttributes extends Optional<AdCampaignAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'spent' | 'viewsDelivered' | 'uniqueViews' | 'paymentStatus' | 'cpv' | 'metadata'> {
}
export declare class AdCampaign extends Model<AdCampaignAttributes, AdCampaignCreationAttributes> implements AdCampaignAttributes {
    id: string;
    name: string;
    advertiserId: string;
    targetViews: number;
    status: CampaignStatus;
    budget: number;
    spent: number;
    viewsDelivered: number;
    currentClicks: number;
    uniqueViews: number;
    targeting: string[];
    paymentStatus: PaymentStatus;
    cpv: number;
    startDate?: Date;
    endDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export default AdCampaign;
//# sourceMappingURL=AdCampaign.d.ts.map