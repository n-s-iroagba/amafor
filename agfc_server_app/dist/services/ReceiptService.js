"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptService = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class ReceiptService {
    /**
     * Generate receipt data for a payment
     */
    async generateReceipt(payment) {
        try {
            const receiptData = {
                receiptNumber: `RCP-${payment.reference}`,
                paymentReference: payment.reference,
                paymentDate: payment.paidAt,
                amount: payment.amount,
                currency: 'NGN',
                status: payment.status,
                applicant: {
                    name: payment.applicantUser ? `${payment.applicantUser.username}` : 'Unknown Applicant',
                    email: payment.applicantUser?.email,
                },
                sessionInfo: {
                    sessionId: payment.sessionId,
                    programId: payment.programId,
                },
                generatedAt: new Date(),
                type: 'application_fee',
            };
            logger_1.default.info('Generated receipt data', {
                receiptNumber: receiptData.receiptNumber,
                paymentReference: payment.reference,
            });
            return receiptData;
        }
        catch (error) {
            logger_1.default.error('Error generating receipt:', error);
            throw error;
        }
    }
    /**
     * Generate PDF receipt (if you want to create PDF receipts)
     */
    async generatePDFReceipt(payment) {
        try {
            // This would require a PDF generation library like puppeteer or pdfkit
            // For now, returning a placeholder implementation
            const receiptData = await this.generateReceipt(payment);
            // Convert to PDF using your preferred PDF library
            // const pdfBuffer = await generatePDF(receiptData)
            // Placeholder - return JSON as buffer for now
            const buffer = Buffer.from(JSON.stringify(receiptData, null, 2), 'utf-8');
            return {
                buffer,
                type: 'pdf',
            };
        }
        catch (error) {
            logger_1.default.error('Error generating PDF receipt:', error);
            throw error;
        }
    }
}
exports.ReceiptService = ReceiptService;
//# sourceMappingURL=ReceiptService.js.map