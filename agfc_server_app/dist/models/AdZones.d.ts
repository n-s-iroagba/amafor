import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
export declare enum AdZoneStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    MAINTENANCE = "maintenance"
}
export declare enum AdZoneType {
    BANNER = "banner",
    SIDEBAR = "sidebar",
    INLINE = "inline",
    FOOTER = "footer"
}
export interface AdZoneAttributes {
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
export declare type AdZoneCreationAttributes = Omit<AdZoneAttributes, 'createdAt' | 'updatedAt'> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export declare class AdZoneModel extends Model<InferAttributes<AdZoneModel>, InferCreationAttributes<AdZoneModel>> {
    id: string;
    name: string;
    description: CreationOptional<string | null>;
    pricePerView: number;
    type: AdZoneType;
    dimensions: string;
    maxSize: string;
    tags: string[];
    status: AdZoneStatus;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    getFormattedPrice(): string;
}
export default AdZoneModel;
//# sourceMappingURL=AdZones.d.ts.map