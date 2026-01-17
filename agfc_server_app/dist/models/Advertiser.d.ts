import { Model, Optional } from 'sequelize';
export interface AdvertiserAttributes {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;
    website?: string;
    industry?: string;
    address?: string;
    status: 'active' | 'inactive' | 'suspended';
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AdvertiserCreationAttributes extends Optional<AdvertiserAttributes, 'id' | 'phone' | 'website' | 'industry' | 'address' | 'status' | 'createdAt' | 'updatedAt'> {
}
declare class Advertiser extends Model<AdvertiserAttributes, AdvertiserCreationAttributes> implements AdvertiserAttributes {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;
    website?: string;
    industry?: string;
    address?: string;
    status: 'active' | 'inactive' | 'suspended';
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Advertiser;
//# sourceMappingURL=Advertiser.d.ts.map