import { Dispute, DisputeCreationAttributes } from '@models/Dispute';
export declare class DisputeService {
    private disputeRepository;
    constructor();
    createDispute(data: DisputeCreationAttributes): Promise<Dispute>;
    getDisputesByAdvertiser(advertiserId: string): Promise<Dispute[]>;
    getDisputeById(id: string): Promise<Dispute | null>;
}
//# sourceMappingURL=DisputeService.d.ts.map