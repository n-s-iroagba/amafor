import { Request, Response } from 'express';
export declare class PaymentGatewayController {
    static handleWebhook(req: Request, res: Response): Promise<void>;
    static initializePayment(req: Request, res: Response): Promise<void>;
    static verifyTransaction(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PaymentGatewayController.d.ts.map