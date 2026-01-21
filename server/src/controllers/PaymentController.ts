// controllers/PaymentController.ts
import { Request, Response } from 'express';
import { PaymentService } from '@services/PaymentService';
import { CreateAdvertisementPaymentData, CreateDonationPaymentData } from '@services/PaymentService';
import logger from '@utils/logger';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async initiateAdvertisementPayment(req: Request, res: Response) {
    try {
      const data: CreateAdvertisementPaymentData = {
        userId: req.user.id,
        adCampaignId: req.body.adCampaignId,
        amount: parseFloat(req.body.amount),
        currency: req.body.currency,
        customerEmail: req.body.email || req.user.email,
        customerName: req.body.name || `${req.user.firstName} ${req.user.lastName}`,
        customerPhone: req.body.phone,
        metadata: req.body.metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      };

      const result = await this.paymentService.createAdvertisementPayment(data);

      res.status(200).json({
        success: true,
        message: 'Payment initiated successfully',
        data: result,
      });
    } catch (error: any) {
      logger.error('Failed to initiate advertisement payment', {
        error: error.message,
        userId: req.user.id,
      });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to initiate payment',
      });
    }
  }

  async initiateDonationPayment(req: Request, res: Response) {
    try {
      const data: CreateDonationPaymentData = {
        userId: req.user.id,
        donationId: req.body.donationId,
        amount: parseFloat(req.body.amount),
        currency: req.body.currency,
        customerEmail: req.body.email || req.user.email,
        customerName: req.body.name || `${req.user.firstName} ${req.user.lastName}`,
        customerPhone: req.body.phone,
        metadata: req.body.metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      };

      const result = await this.paymentService.createDonationPayment(data);

      res.status(200).json({
        success: true,
        message: 'Donation payment initiated successfully',
        data: result,
      });
    } catch (error: any) {
      logger.error('Failed to initiate donation payment', {
        error: error.message,
        userId: req.user.id,
      });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to initiate donation payment',
      });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      const { reference } = req.params;
      const result = await this.paymentService.verifyPayment(reference);

      res.status(200).json({
        success: true,
        message: 'Payment verification completed',
        data: result,
      });
    } catch (error: any) {
      logger.error('Failed to verify payment', {
        error: error.message,
        reference: req.params.reference,
      });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to verify payment',
      });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      
      await this.paymentService.handleWebhook(req.body, signature);

      res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error: any) {
      logger.error('Failed to process webhook', {
        error: error.message,
      });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to process webhook',
      });
    }
  }

  async getPaymentDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPaymentById(id);

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      logger.error('Failed to get payment details', {
        error: error.message,
        paymentId: req.params.id,
      });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get payment details',
      });
    }
  }

  async getUserPayments(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user.id;

      const result = await this.paymentService.getUserPayments(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Failed to get user payments', {
        error: error.message,
        userId: req.user.id,
      });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to get user payments',
      });
    }
  }

  async getPaymentStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await this.paymentService.getPaymentStats(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Failed to get payment stats', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get payment stats',
      });
    }
  }

  async refundPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.refundPayment(id);

      res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment,
      });
    } catch (error: any) {
      logger.error('Failed to refund payment', {
        error: error.message,
        paymentId: req.params.id,
      });
      
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to refund payment',
      });
    }
  }
}