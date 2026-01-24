import { DisputeRepository, IDisputeRepository } from '../repositories/DisputeRepository';
import { Dispute, DisputeCreationAttributes } from '@models/Dispute';
import { tracer } from '../utils';

export class DisputeService {
    private disputeRepository: IDisputeRepository;

    constructor() {
        this.disputeRepository = new DisputeRepository();
    }

    async createDispute(data: DisputeCreationAttributes): Promise<Dispute> {
        return tracer.startActiveSpan('service.DisputeService.createDispute', async (span) => {
            try {
                return await this.disputeRepository.create(data);
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    async getDisputesByAdvertiser(advertiserId: string): Promise<Dispute[]> {
        return await this.disputeRepository.findByAdvertiser(advertiserId);
    }

    async getDisputeById(id: string): Promise<Dispute | null> {
        return await this.disputeRepository.findById(id);
    }

    // Method for admin/support to reply (optional for now)
}
