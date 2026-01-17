/// <reference types="node" />
import { AdSubscriptionPayment } from '../models/AdSubscriptionPayment';
export declare class ReceiptService {
    /**
     * Generate receipt data for a payment
     */
    generateReceipt(payment: any): Promise<any>;
    /**
     * Generate PDF receipt (if you want to create PDF receipts)
     */
    generatePDFReceipt(payment: AdSubscriptionPayment): Promise<{
        buffer: Buffer;
        type: string;
    }>;
}
//# sourceMappingURL=ReceiptService.d.ts.map