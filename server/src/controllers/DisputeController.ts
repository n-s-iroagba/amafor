import { Request, Response, NextFunction } from 'express';
import { DisputeService } from '../services/DisputeService';
import tracer from '../utils/tracer';

export class DisputeController {
    private disputeService: DisputeService;

    constructor() {
        this.disputeService = new DisputeService();
    }

    public createDispute = async (req: Request, res: Response, next: NextFunction) => {
        return tracer.startActiveSpan('controller.DisputeController.createDispute', async (span) => {
            try {
                const advertiserId = (req as any).user.id;
                const dispute = await this.disputeService.createDispute({
                    ...req.body,
                    advertiserId
                });
                res.status(201).json({ success: true, data: dispute });
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                next(error);
            } finally {
                span.end();
            }
        });
    };

    public getMyDisputes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const advertiserId = (req as any).user.id;
            const disputes = await this.disputeService.getDisputesByAdvertiser(advertiserId);
            res.status(200).json({ success: true, data: disputes });
        } catch (error: any) {
            next(error);
        }
    };

    public getDispute = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const dispute = await this.disputeService.getDisputeById(id);
            if (!dispute) {
                res.status(404).json({ success: false, message: 'Dispute not found' });
                return;
            }
            res.status(200).json({ success: true, data: dispute });
        } catch (error: any) {
            next(error);
        }
    };
}
