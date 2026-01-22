import { Request, Response } from 'express';
export declare class PaymentGatewayController {
    /**
     * Payment gateway webhook
     * @api POST /payments/webhook
     * @apiName API-PAYMENT-005
     * @apiGroup Payments
     * @srsRequirement REQ-ADV-04
     */
    static handleWebhook(req: Request, res: Response): Promise<void>;
    /**
     * Initialize payment
     * @api POST /payments/initialize
     * @apiName API-PAYMENT-003
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-01, REQ-SUP-02, REQ-ADV-04
     */
    static initializePayment(req: Request, res: Response): Promise<void>;
    /**
     * Verify transaction
     * @api POST /payments/verify/:reference
     * @apiName API-PAYMENT-004
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-01, REQ-SUP-02, REQ-ADV-04
     */
    static verifyTransaction(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PaymentGatewayController.d.ts.map