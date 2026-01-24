import { BaseRepository } from './BaseRepository';
import { Dispute, DisputeAttributes, DisputeCreationAttributes } from '@models/Dispute';

export interface IDisputeRepository {
    findById(id: string): Promise<Dispute | null>;
    findAll(options?: any): Promise<Dispute[]>;
    create(data: DisputeCreationAttributes): Promise<Dispute>;
    update(id: string, data: Partial<DisputeAttributes>): Promise<[number, Dispute[]]>;
    delete(id: string): Promise<number>;
    findByAdvertiser(advertiserId: string): Promise<Dispute[]>;
}

export class DisputeRepository extends BaseRepository<Dispute> implements IDisputeRepository {
    constructor() {
        super(Dispute);
    }

    async findByAdvertiser(advertiserId: string): Promise<Dispute[]> {
        return await this.findAll({
            where: { advertiserId },
            order: [['createdAt', 'DESC']]
        });
    }
}
