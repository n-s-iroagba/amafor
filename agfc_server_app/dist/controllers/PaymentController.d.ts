import { Request, Response } from 'express';
export declare class PaymentController {
    private paymentService;
    constructor();
    initiateAdvertisementPayment(req: Request, res: Response): Promise<void>;
    initiateDonationPayment(req: Request, res: Response): Promise<void>;
    verifyPayment(req: Request, res: Response): Promise<void>;
    handleWebhook(req: Request, res: Response): Promise<void>;
    getPaymentDetails(req: Request, res: Response): Promise<void>;
    getUserPayments(req: Request, res: Response): Promise<void>;
    getPaymentStats(req: Request, res: Response): Promise<void>;
    refundPayment(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PaymentController.d.ts.map