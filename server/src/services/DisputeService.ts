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

    async getAllDisputes(): Promise<Dispute[]> {
        return await this.disputeRepository.findAll({
            include: ['advertiser'],
            order: [['createdAt', 'DESC']]
        });
    }

    async getDisputeById(id: string): Promise<Dispute | null> {
        return await this.disputeRepository.findById(id);
    }

    async resolveDispute(id: string, adminResponse: string, status: 'resolved' | 'closed' | 'investigation'): Promise<Dispute | null> {
        return tracer.startActiveSpan('service.DisputeService.resolveDispute', async (span) => {
            try {
                const dispute = await this.disputeRepository.findById(id);
                if (!dispute) {
                    throw new Error('Dispute not found');
                }

                const [_, updatedDisputes] = await this.disputeRepository.update(id, {
                    adminResponse,
                    status
                });

                return updatedDisputes[0];
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    // Method for admin/support to reply (optional for now)
}
