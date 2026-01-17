"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// EmailService.ts - Unified Email Service with best practices
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../utils/logger"));
class EmailService {
    constructor(url) {
        this.url = url;
        this.config = this.getEmailConfig();
        this.transporter = this.createTransporter();
        this.clientUrl = process.env.NODE_ENV === 'production' ? 'https://www.palmwebtv.com' : 'http://localhost:3000';
    }
    // Singleton pattern for EmailService
    static getInstance(url) {
        if (!EmailService.instance) {
            if (!url) {
                throw new Error('url is required for first EmailService instantiation');
            }
            EmailService.instance = new EmailService(url);
        }
        return EmailService.instance;
    }
    getEmailConfig() {
        return {
            host: 'mail.privateemail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'do-not-reply@palmwebtv.com',
                pass: 'palmweb4425',
            },
            from: 'do-not-reply@palmwebtv.com'
        };
    }
    createTransporter() {
        const transporter = nodemailer_1.default.createTransport(this.config);
        // Verify connection configuration on startup
        transporter.verify((error) => {
            if (error) {
                logger_1.default.error('SMTP connection failed', {
                    error: error.message,
                    host: this.config.host,
                    port: this.config.port,
                });
            }
            else {
                logger_1.default.info('SMTP server is ready to send emails');
            }
        });
        return transporter;
    }
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: this.config.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.stripHtml(options.html),
                attachments: options.attachments || [],
            };
            const info = await this.transporter.sendMail(mailOptions);
            logger_1.default.info('Email sent successfully', {
                messageId: info.messageId,
                to: options.to,
                subject: options.subject,
                response: info.response,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send email', {
                to: options.to,
                subject: options.subject,
                error: error.message,
                stack: error.stack,
            });
            throw new Error(`Failed to send email to ${options.to}: ${error.message}`);
        }
    }
    stripHtml(html) {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();
    }
    // Email Templates
    getBaseEmailStyles() {
        return `
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 8px; 
          overflow: hidden; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .content { padding: 30px; }
        .button { 
          display: inline-block; 
          background: #007bff; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
          font-weight: 600;
          transition: background-color 0.3s;
        }
        .button:hover { background: #0056b3; }
        .button.danger { background: #dc3545; }
        .button.danger:hover { background: #c82333; }
        .button.success { background: #28a745; }
        .button.success:hover { background: #218838; }
        .details-box { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 6px; 
          margin: 20px 0;
          border-left: 4px solid #007bff;
        }
        .warning-box { 
          background: #fff3cd; 
          border: 1px solid #ffeaa7; 
          padding: 15px; 
          border-radius: 6px; 
          margin: 20px 0;
          border-left: 4px solid #ffc107;
        }
        .error-box {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          border-left: 4px solid #dc3545;
        }
        .footer { 
          background: #f8f9fa;
          padding: 20px; 
          text-align: center;
          font-size: 12px; 
          color: #666; 
          border-top: 1px solid #eee;
        }
        .text-center { text-align: center; }
        .mt-0 { margin-top: 0; }
      </style>
    `;
    }
    // Verification Email
    async sendVerificationEmail(user) {
        try {
            const verificationUrl = `${this.clientUrl}/verify-email/${user.verificationToken}`;
            const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${this.getBaseEmailStyles()}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Welcome ${user.username}!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Please verify your email address</p>
              </div>
              
              <div class="content">
                <p>Thank you for signing up! To complete your registration, please verify your email address.</p>
                
                <div class="details-box">
                  <h3 class="mt-0">Verification Code</h3>
                  <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0;">${user.verificationCode}</p>
                  <p><em>You can also use the button below for quick verification</em></p>
                </div>
                
                <div class="text-center">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p><strong>Alternative method:</strong> Copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #007bff; background: #f8f9fa; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
                
                <div class="warning-box">
                  <strong>⚠️ Important:</strong>
                  <ul style="margin: 10px 0;">
                    <li>This verification link will expire in 24 hours</li>
                    <li>Your account will remain inactive until verified</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>If you didn't create this account, please ignore this email.</p>
                <p>&copy; ${new Date().getFullYear()} Palm Web Tv. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
            await this.sendEmail({
                to: user.email,
                subject: 'Verify Your Email Address',
                html,
            });
            logger_1.default.info('Verification email sent successfully', {
                userId: user.id,
                email: user.email,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send verification email', {
                userId: user.id,
                email: user.email,
                error: error.message,
            });
            throw new Error('Failed to send verification email');
        }
    }
    // Password Reset Email
    async sendPasswordResetEmail(email, token) {
        try {
            const resetUrl = `${this.clientUrl}/auth/reset-password/${token}`;
            const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${this.getBaseEmailStyles()}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Password Reset Request</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Secure password reset for your account</p>
              </div>
              
              <div class="content">
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <div class="text-center">
                  <a href="${resetUrl}" class="button danger">Reset Password</a>
                </div>
                
                <p><strong>Alternative method:</strong> Copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #dc3545; background: #f8f9fa; padding: 10px; border-radius: 4px;">${resetUrl}</p>
                
                <div class="error-box">
                  <strong>🔒 Security Notice:</strong>
                  <ul style="margin: 10px 0;">
                    <li>This link will expire in 1 hour for security</li>
                    <li>This link can only be used once</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your current password remains unchanged until you complete the reset</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
                <p>&copy; ${new Date().getFullYear()} Palm Web Tv. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
            await this.sendEmail({
                to: email,
                subject: 'Password Reset Request - Palm Web Tv',
                html,
            });
            logger_1.default.info('Password reset email sent successfully', { email });
        }
        catch (error) {
            console.error(error);
            logger_1.default.error('Failed to send password reset email', {
                email,
                error: error.message,
            });
            throw new Error('Failed to send password reset email');
        }
    }
    // Receipt Email
    async sendReceiptEmail({ to, advertiserName, payment, receiptData, }) {
        try {
            const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${this.getBaseEmailStyles()}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Payment Received</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your application fee has been processed</p>
              </div>
              
              <div class="content">
                <p>Dear ${advertiserName},</p>
                
                <p>Thank you for your payment! Your application fee has been successfully processed. You can now proceed with your application.</p>
                
                <div class="details-box">
                  <h3 class="mt-0">Payment Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 8px 0; font-weight: 600;">Receipt Number:</td>
                      <td style="padding: 8px 0;">${receiptData.receiptNumber}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 8px 0; font-weight: 600;">Payment Reference:</td>
                      <td style="padding: 8px 0;">${payment.reference}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 8px 0; font-weight: 600;">Amount:</td>
                      <td style="padding: 8px 0; color: #28a745; font-weight: 600;">$ ${payment.amountPaid.toLocaleString()}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 8px 0; font-weight: 600;">Payment Date:</td>
                      <td style="padding: 8px 0;">${(payment.paidAt ? new Date(payment?.paidAt) : new Date()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600;">Status:</td>
                      <td style="padding: 8px 0;">
                        <span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                          ${payment.status}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                
                <div class="text-center">
               
                  <a href="${this.url}/application/continue" class="button success">Continue Application</a>
                </div>
                
                <p style="margin-top: 30px;"><strong>What's Next?</strong></p>
                <ol>
                  <li>Save your receipt for your records</li>
                  <li>Complete your application form</li>
                  <li>Upload required documents</li>
                  <li>Submit your application before the deadline</li>
                </ol>
              </div>
              
              <div class="footer">
                <p>Keep this email for your records. You may need the receipt for future reference.</p>
                <p>&copy; ${new Date().getFullYear()} Palm Web Tv. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
            await this.sendEmail({
                to,
                subject: `Payment Receipt - ${receiptData.receiptNumber}`,
                html,
            });
            logger_1.default.info('Receipt email sent successfully', {
                to,
                receiptNumber: receiptData.receiptNumber,
                paymentReference: payment.reference,
            });
        }
        catch (error) {
            logger_1.default.error('Error sending receipt email:', {
                to,
                paymentReference: payment.reference,
                error: error.message,
            });
            throw error;
        }
    }
    async sendFailedPaymentEmail({ to, advertiserName, payment, failureReason, }) {
        try {
            const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${this.getBaseEmailStyles()}
          </head>
          <body>
            <div class="container">
              <div class="header" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);">
                <h1 style="margin: 0;">Payment Failed</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">We couldn't process your payment</p>
              </div>
              
              <div class="content">
                <p>Dear ${advertiserName},</p>
                
                <p>We're sorry to inform you that your payment could not be processed successfully. This can happen for various reasons, and it's usually easy to resolve.</p>
                
                <div class="error-box">
                  <h3 class="mt-0">Payment Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #f5c6cb;">
                      <td style="padding: 8px 0; font-weight: 600;">Payment Reference:</td>
                      <td style="padding: 8px 0;">${payment.reference}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f5c6cb;">
                      <td style="padding: 8px 0; font-weight: 600;">Amount:</td>
                      <td style="padding: 8px 0;">${'NGN'} ${payment.amountPaid.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600;">Failure Reason:</td>
                      <td style="padding: 8px 0; color: #721c24;">${failureReason}</td>
                    </tr>
                  </table>
                </div>
                
                <p><strong>Common Solutions:</strong></p>
                <ul>
                  <li>Check that your card has sufficient funds</li>
                  <li>Verify your card details are correct</li>
                  <li>Ensure your card is enabled for online transactions</li>
                  <li>Try using a different payment method</li>
                </ul>
                
                <div class="text-center">
                  <a href="${this.url}/payment/retry/${payment.reference}" class="button success">Try Payment Again</a>
                  <a href="${this.url}/support" class="button">Contact Support</a>
                </div>
              </div>
              
              <div class="footer">
                <p>Need help? Contact our support team at support@yourapp.com</p>
                <p>&copy; ${new Date().getFullYear()} Palm Web Tv. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
            await this.sendEmail({
                to,
                subject: `Payment Failed - Reference: ${payment.reference}`,
                html,
            });
            logger_1.default.info('Failed payment email sent successfully', {
                to,
                paymentReference: payment.reference,
                failureReason,
            });
        }
        catch (error) {
            logger_1.default.error('Error sending failed payment email:', {
                to,
                paymentReference: payment.reference,
                error: error.message,
            });
            throw error;
        }
    }
    // Generic method for custom emails
    async sendCustomEmail(to, subject, html, text, attachments) {
        try {
            await this.sendEmail({ to, subject, html, text, attachments });
            logger_1.default.info('Custom email sent successfully', { to, subject });
        }
        catch (error) {
            logger_1.default.error('Failed to send custom email', {
                to,
                subject,
                error: error.message,
            });
            throw new Error('Failed to send custom email');
        }
    }
    // Bulk email method
    async sendBulkEmails(emails) {
        const results = {
            successful: 0,
            failed: [],
        };
        for (const emailOptions of emails) {
            try {
                await this.sendEmail(emailOptions);
                results.successful++;
            }
            catch (error) {
                results.failed.push({
                    email: emailOptions.to,
                    error: error.message,
                });
            }
        }
        logger_1.default.info('Bulk email operation completed', {
            total: emails.length,
            successful: results.successful,
            failed: results.failed.length,
        });
        return results;
    }
    // Test email connection
    async testConnection() {
        try {
            await this.transporter.verify();
            logger_1.default.info('Email service connection test passed');
            return true;
        }
        catch (error) {
            logger_1.default.error('Email service connection test failed', {
                error: error.message,
                config: {
                    host: this.config.host,
                    port: this.config.port,
                    user: this.config.auth.user,
                },
            });
            return false;
        }
    }
    // Health check method
    async healthCheck() {
        try {
            const isConnected = await this.testConnection();
            return {
                status: isConnected ? 'healthy' : 'unhealthy',
                message: isConnected ? 'Email service is operational' : 'Email service connection failed',
                timestamp: new Date(),
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Email service error: ${error.message}`,
                timestamp: new Date(),
            };
        }
    }
}
exports.default = EmailService; // Replace with your actual client URL
//# sourceMappingURL=EmailService.js.map