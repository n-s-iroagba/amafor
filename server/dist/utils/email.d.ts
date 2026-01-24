export interface EmailOptions {
    to: string | string[];
    subject: string;
    template?: string;
    html?: string;
    text?: string;
    data?: Record<string, any>;
    attachments?: any[];
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
}
export interface EmailSendResult {
    success: boolean;
    messageId?: string;
    error?: string;
    accepted?: string[];
    rejected?: string[];
}
export declare const sendEmail: (options: EmailOptions) => Promise<EmailSendResult>;
export declare const sendVerificationEmail: (email: string, name: string, token: string) => Promise<EmailSendResult>;
export declare const sendPasswordResetEmail: (email: string, name: string, token: string) => Promise<EmailSendResult>;
export declare const sendWelcomeEmail: (email: string, name: string, userType: string) => Promise<EmailSendResult>;
export declare const sendDonationReceipt: (email: string, name: string, amount: number, currency: string, reference: string, date: Date) => Promise<EmailSendResult>;
export declare const sendCampaignApprovalEmail: (email: string, campaignName: string, advertiserName: string) => Promise<EmailSendResult>;
export declare const sendScoutApprovalEmail: (email: string, scoutName: string) => Promise<EmailSendResult>;
export declare const sendPatronWelcomeEmail: (email: string, name: string, tier: string, amount: number, frequency: string) => Promise<EmailSendResult>;
export declare const sendSystemNotificationEmail: (email: string, subject: string, message: string, actionUrl?: string) => Promise<EmailSendResult>;
export declare const sendBatchJobCompletionEmail: (email: string, jobType: string, successCount: number, failureCount: number, totalCount: number, downloadUrl?: string) => Promise<EmailSendResult>;
export declare const sendRatesChangeNotification: (advertiserEmails: string[], effectiveDate: Date, changes: Array<{
    zone: string;
    oldRate: number;
    newRate: number;
}>) => Promise<EmailSendResult[]>;
export declare const sendDailySummaryEmail: (adminEmails: string[], summary: {
    date: string;
    newUsers: number;
    newDonations: number;
    totalDonations: number;
    activeCampaigns: number;
    newPatrons: number;
    systemAlerts: number;
}) => Promise<EmailSendResult[]>;
export declare const checkEmailHealth: () => Promise<{
    healthy: boolean;
    latency?: number;
    error?: string;
}>;
export declare const generateUnsubscribeLink: (email: string, subscriptionType: string) => string;
export declare const validateUnsubscribeToken: (token: string) => {
    email: string;
    subscriptionType: string;
    timestamp: number;
} | null;
declare const _default: {
    sendEmail: (options: EmailOptions) => Promise<EmailSendResult>;
    sendVerificationEmail: (email: string, name: string, token: string) => Promise<EmailSendResult>;
    sendPasswordResetEmail: (email: string, name: string, token: string) => Promise<EmailSendResult>;
    sendWelcomeEmail: (email: string, name: string, userType: string) => Promise<EmailSendResult>;
    sendDonationReceipt: (email: string, name: string, amount: number, currency: string, reference: string, date: Date) => Promise<EmailSendResult>;
    sendCampaignApprovalEmail: (email: string, campaignName: string, advertiserName: string) => Promise<EmailSendResult>;
    sendScoutApprovalEmail: (email: string, scoutName: string) => Promise<EmailSendResult>;
    sendPatronWelcomeEmail: (email: string, name: string, tier: string, amount: number, frequency: string) => Promise<EmailSendResult>;
    sendSystemNotificationEmail: (email: string, subject: string, message: string, actionUrl?: string) => Promise<EmailSendResult>;
    sendBatchJobCompletionEmail: (email: string, jobType: string, successCount: number, failureCount: number, totalCount: number, downloadUrl?: string) => Promise<EmailSendResult>;
    sendRatesChangeNotification: (advertiserEmails: string[], effectiveDate: Date, changes: Array<{
        zone: string;
        oldRate: number;
        newRate: number;
    }>) => Promise<EmailSendResult[]>;
    sendDailySummaryEmail: (adminEmails: string[], summary: {
        date: string;
        newUsers: number;
        newDonations: number;
        totalDonations: number;
        activeCampaigns: number;
        newPatrons: number;
        systemAlerts: number;
    }) => Promise<EmailSendResult[]>;
    checkEmailHealth: () => Promise<{
        healthy: boolean;
        latency?: number;
        error?: string;
    }>;
    generateUnsubscribeLink: (email: string, subscriptionType: string) => string;
    validateUnsubscribeToken: (token: string) => {
        email: string;
        subscriptionType: string;
        timestamp: number;
    } | null;
    EMAIL_FROM: string;
    EMAIL_FROM_NAME: string;
};
export default _default;
//# sourceMappingURL=email.d.ts.map