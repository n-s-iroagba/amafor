import nodemailer from 'nodemailer';
import { logger } from './logger';
import { tracer } from './tracer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@amaforgladiatorsfc.com';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Amafor Gladiators FC';

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter connection
transporter.verify((error) => {
  if (error) {
    logger.error('Email transporter verification failed', { error });
  } else {
    logger.info('Email transporter is ready to send messages');
  }
});

// Load email templates
const templates: Record<string, handlebars.TemplateDelegate> = {};

const loadTemplates = () => {
  const templatesDir = path.join(__dirname, '../templates/email');

  if (!fs.existsSync(templatesDir)) {
    logger.warn('Email templates directory not found', { path: templatesDir });
    return;
  }

  const templateFiles = fs.readdirSync(templatesDir);

  templateFiles.forEach(file => {
    if (file.endsWith('.hbs')) {
      const templatePath = path.join(templatesDir, file);
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const templateName = path.basename(file, '.hbs');
      templates[templateName] = handlebars.compile(templateContent);

      logger.debug('Loaded email template', { template: templateName });
    }
  });
};

// Load templates on startup
loadTemplates();

// Email interfaces
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

// Send email
export const sendEmail = async (options: EmailOptions): Promise<EmailSendResult> => {
  return tracer.startActiveSpan('email.send', async (span) => {
    try {
      span.setAttributes({
        'email.to': Array.isArray(options.to) ? options.to.join(',') : options.to,
        'email.subject': options.subject,
        'email.template': options.template || 'custom',
      });

      let html = options.html;
      let text = options.text;

      // Use template if specified
      if (options.template && templates[options.template]) {
        const templateData = {
          ...options.data,
          year: new Date().getFullYear(),
          siteUrl: process.env.FRONTEND_URL || 'https://amaforgladiatorsfc.com',
          supportEmail: 'support@amaforgladiatorsfc.com',
        };

        html = templates[options.template](templateData);
        text = html.replace(/<[^>]*>/g, ' '); // Basic HTML to text conversion
      }

      const mailOptions = {
        from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html,
        text,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments,
        headers: {
          'X-Priority': '3',
          'X-Mailer': 'Amafor Gladiators FC Email Service',
        },
      };

      const info = await transporter.sendMail(mailOptions);

      span.setAttributes({
        'email.success': true,
        'email.message_id': info.messageId,
        'email.accepted': info.accepted?.length || 0,
        'email.rejected': info.rejected?.length || 0,
      });

      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
      });

      return {
        success: true,
        messageId: info.messageId,
        accepted: info.accepted as any,
        rejected: info.rejected as any,
      };
    } catch (error) {
      const err = error as any;
      span.setStatus({
        code: 2,
        message: err.message,
      });

      logger.error('Error sending email', {
        error: err.message,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: false,
        error: err.message,
      };
    } finally {
      span.end();
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<EmailSendResult> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - Amafor Gladiators FC',
    template: 'verification',
    data: {
      name,
      verificationUrl,
      expiryHours: 24,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, name: string, token: string): Promise<EmailSendResult> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Amafor Gladiators FC',
    template: 'password-reset',
    data: {
      name,
      resetUrl,
      expiryHours: 1,
    },
  });
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, name: string, userType: string): Promise<EmailSendResult> => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Amafor Gladiators FC!',
    template: 'welcome',
    data: {
      name,
      userType,
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      supportEmail: 'support@amaforgladiatorsfc.com',
    },
  });
};

// Send donation receipt
export const sendDonationReceipt = async (
  email: string,
  name: string,
  amount: number,
  currency: string,
  reference: string,
  date: Date
): Promise<EmailSendResult> => {
  return sendEmail({
    to: email,
    subject: 'Donation Receipt - Amafor Gladiators FC',
    template: 'donation-receipt',
    data: {
      name,
      amount: amount.toLocaleString(),
      currency,
      reference,
      date: date.toLocaleDateString(),
      receiptUrl: `${process.env.FRONTEND_URL}/donations/receipt/${reference}`,
    },
  });
};

// Send campaign approval email
export const sendCampaignApprovalEmail = async (
  email: string,
  campaignName: string,
  advertiserName: string
): Promise<EmailSendResult> => {
  return sendEmail({
    to: email,
    subject: 'Your Ad Campaign Has Been Approved!',
    template: 'campaign-approved',
    data: {
      advertiserName,
      campaignName,
      dashboardUrl: `${process.env.FRONTEND_URL}/advertiser/dashboard`,
    },
  });
};

// Send scout application approved email
export const sendScoutApprovalEmail = async (
  email: string,
  scoutName: string
): Promise<EmailSendResult> => {
  return sendEmail({
    to: email,
    subject: 'Scout Application Approved - Amafor Gladiators FC',
    template: 'scout-approved',
    data: {
      scoutName,
      portalUrl: `${process.env.FRONTEND_URL}/pro-view`,
      supportEmail: 'support@amaforgladiatorsfc.com',
    },
  });
};

// Send patron welcome email
export const sendPatronWelcomeEmail = async (
  email: string,
  name: string,
  tier: string,
  amount: number,
  frequency: string
): Promise<EmailSendResult> => {
  return sendEmail({
    to: email,
    subject: 'Welcome to the Patron Community!',
    template: 'patron-welcome',
    data: {
      name,
      tier,
      amount: amount.toLocaleString(),
      frequency,
      patronPageUrl: `${process.env.FRONTEND_URL}/patrons`,
      accountUrl: `${process.env.FRONTEND_URL}/account/subscriptions`,
    },
  });
};

// Send system notification email
export const sendSystemNotificationEmail = async (
  email: string,
  subject: string,
  message: string,
  actionUrl?: string
): Promise<EmailSendResult> => {
  return sendEmail({
    to: email,
    subject: subject,
    template: 'system-notification',
    data: {
      message,
      actionUrl,
      siteUrl: process.env.FRONTEND_URL || 'https://amaforgladiatorsfc.com',
    },
  });
};

// Send batch job completion email
export const sendBatchJobCompletionEmail = async (
  email: string,
  jobType: string,
  successCount: number,
  failureCount: number,
  totalCount: number,
  downloadUrl?: string
): Promise<EmailSendResult> => {
  return sendEmail({
    to: email,
    subject: `Batch ${jobType} Completed`,
    template: 'batch-job-complete',
    data: {
      jobType,
      successCount,
      failureCount,
      totalCount,
      downloadUrl,
      completionTime: new Date().toLocaleString(),
    },
  });
};

// Send advertising rates change notification
export const sendRatesChangeNotification = async (
  advertiserEmails: string[],
  effectiveDate: Date,
  changes: Array<{ zone: string; oldRate: number; newRate: number }>
): Promise<EmailSendResult[]> => {
  const promises = advertiserEmails.map(email =>
    sendEmail({
      to: email,
      subject: 'Upcoming Changes to Advertising Rates',
      template: 'rates-change',
      data: {
        effectiveDate: effectiveDate.toLocaleDateString(),
        noticeDays: Math.ceil((effectiveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        changes,
        contactEmail: 'advertising@amaforgladiatorsfc.com',
      },
    })
  );

  return Promise.all(promises);
};

// Send daily summary email (for admins)
export const sendDailySummaryEmail = async (
  adminEmails: string[],
  summary: {
    date: string;
    newUsers: number;
    newDonations: number;
    totalDonations: number;
    activeCampaigns: number;
    newPatrons: number;
    systemAlerts: number;
  }
): Promise<EmailSendResult[]> => {
  const promises = adminEmails.map(email =>
    sendEmail({
      to: email,
      subject: `Daily Summary - ${summary.date}`,
      template: 'daily-summary',
      data: summary,
    })
  );

  return Promise.all(promises);
};

// Check email service health
export const checkEmailHealth = async (): Promise<{
  healthy: boolean;
  latency?: number;
  error?: string;
}> => {
  return tracer.startActiveSpan('email.checkHealth', async (span) => {
    try {
      const startTime = Date.now();

      await transporter.verify();

      const latency = Date.now() - startTime;

      span.setAttributes({
        'email.healthy': true,
        'email.latency_ms': latency,
      });

      return {
        healthy: true,
        latency,
      };
    } catch (error) {
      const err = error as any;
      span.setAttributes({
        'email.healthy': false,
        'email.error': err.message,
      });

      return {
        healthy: false,
        error: err.message,
      };
    } finally {
      span.end();
    }
  });
};

// Generate unsubscribe link
export const generateUnsubscribeLink = (email: string, subscriptionType: string): string => {
  const token = Buffer.from(`${email}:${subscriptionType}:${Date.now()}`).toString('base64');
  return `${process.env.FRONTEND_URL}/unsubscribe?token=${encodeURIComponent(token)}`;
};

// Validate unsubscribe token
export const validateUnsubscribeToken = (token: string): { email: string; subscriptionType: string; timestamp: number } | null => {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [email, subscriptionType, timestamp] = decoded.split(':');

    if (!email || !subscriptionType || !timestamp) {
      return null;
    }

    const tokenDate = new Date(parseInt(timestamp));
    const now = new Date();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

    if (now.getTime() - tokenDate.getTime() > maxAge) {
      return null; // Token expired
    }

    return {
      email,
      subscriptionType,
      timestamp: parseInt(timestamp),
    };
  } catch (error) {
    logger.error('Error validating unsubscribe token', { error });
    return null;
  }
};

// Export all email utilities
export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendDonationReceipt,
  sendCampaignApprovalEmail,
  sendScoutApprovalEmail,
  sendPatronWelcomeEmail,
  sendSystemNotificationEmail,
  sendBatchJobCompletionEmail,
  sendRatesChangeNotification,
  sendDailySummaryEmail,
  checkEmailHealth,
  generateUnsubscribeLink,
  validateUnsubscribeToken,
  EMAIL_FROM,
  EMAIL_FROM_NAME,
};