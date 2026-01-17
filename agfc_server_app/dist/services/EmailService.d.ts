/// <reference types="node" />
import User from '../models/User';
import { AdSubscriptionPayment } from '../models/AdSubscriptionPayment';
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType: string;
    }>;
}
interface ReceiptEmailData {
    to: string;
    advertiserName: string;
    payment: AdSubscriptionPayment;
    receiptData: any;
}
interface FailedPaymentEmailData {
    to: string;
    advertiserName: string;
    payment: AdSubscriptionPayment;
    failureReason: string;
}
declare class EmailService {
    private readonly url;
    private transporter;
    private config;
    private static instance;
    private clientUrl;
    constructor(url: string);
    static getInstance(url?: string): EmailService;
    private getEmailConfig;
    private createTransporter;
    private sendEmail;
    private stripHtml;
    private getBaseEmailStyles;
    sendVerificationEmail(user: User): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendReceiptEmail({ to, advertiserName, payment, receiptData, }: ReceiptEmailData): Promise<void>;
    sendFailedPaymentEmail({ to, advertiserName, payment, failureReason, }: FailedPaymentEmailData): Promise<void>;
    sendCustomEmail(to: string, subject: string, html: string, text?: string, attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType: string;
    }>): Promise<void>;
    sendBulkEmails(emails: EmailOptions[]): Promise<{
        successful: number;
        failed: Array<{
            email: string;
            error: string;
        }>;
    }>;
    testConnection(): Promise<boolean>;
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        message: string;
        timestamp: Date;
    }>;
}
export default EmailService;
export interface PaymentAttributes {
    id: string;
    reference: string;
    amount: number;
    currency?: string;
    status: 'PENDING' | 'PAID' | 'FAILED';
    sessionId: string;
    programId: string;
    applicantUserId: string;
    paidAt?: Date;
    receiptFileId?: string;
    receiptLink?: string;
    receiptGeneratedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=EmailService.d.ts.map