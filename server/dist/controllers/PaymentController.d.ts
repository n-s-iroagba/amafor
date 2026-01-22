import { Request, Response } from 'express';
export declare class PaymentController {
    private paymentService;
    constructor();
    /**
     * Initiate advertisement payment
     * @api POST /payments/advertisement
     * @apiName API-PAYMENT-006
     * @apiGroup Payments
     * @srsRequirement REQ-ADV-04
     */
    initiateAdvertisementPayment(req: Request, res: Response): Promise<void>;
    /**
     * Initiate donation payment
     * @api POST /payments/donation
     * @apiName API-PAYMENT-007
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-01
     */
    initiateDonationPayment(req: Request, res: Response): Promise<void>;
    /**
     * Verify payment
     * @api POST /payments/verify/:reference
     * @apiName API-PAYMENT-004
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-01, REQ-SUP-02, REQ-ADV-04
     */
    verifyPayment(req: Request, res: Response): Promise<void>;
    /**
     * Handle payment webhook
     * @api POST /payments/webhook
     * @apiName API-PAYMENT-005
     * @apiGroup Payments
     * @srsRequirement REQ-ADV-04
     */
    handleWebhook(req: Request, res: Response): Promise<void>;
    /**
     * Get payment details
     * @api GET /payments/:id
     * @apiName API-PAYMENT-008
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    getPaymentDetails(req: Request, res: Response): Promise<void>;
    /**
     * Get user payments
     * @api GET /payments/user
     * @apiName API-PAYMENT-009
     * @apiGroup Payments
     * @srsRequirement REQ-SUP-03
     */
    getUserPayments(req: Request, res: Response): Promise<void>;
    /**
     * Get payment statistics
     * @api GET /payments/stats
     * @apiName API-PAYMENT-010
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    getPaymentStats(req: Request, res: Response): Promise<void>;
    /**
     * Refund payment
     * @api POST /payments/:id/refund
     * @apiName API-PAYMENT-011
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    refundPayment(req: Request, res: Response): Promise<void>;
    /**
     * Get advertiser payments
     * @api GET /payments/advertiser
     * @apiName API-PAYMENT-001
     * @apiGroup Payments
     * @srsRequirement REQ-ADV-05
     */
    getAdvertiserPayments(req: Request, res: Response): Promise<void>;
    /**
     * Get all payments (admin)
     * @api GET /payments
     * @apiName API-PAYMENT-002
     * @apiGroup Payments
     * @srsRequirement REQ-ADM-01
     */
    getAllPayments(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PaymentController.d.ts.map