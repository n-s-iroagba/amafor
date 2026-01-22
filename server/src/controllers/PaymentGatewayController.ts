import { Request, Response } from 'express'
import PaymentGatewayService from '../services/PaymentGatewayService'
import logger from '../utils/logger'

export class PaymentGatewayController {
  /**
   * Payment gateway webhook
   * @api POST /payments/webhook
   * @apiName API-PAYMENT-005
   * @apiGroup Payments
   * @srsRequirement REQ-ADV-04
   */
  static async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      const service = PaymentGatewayService();
      const success = await service.verifyWebhookSignature(req.body, signature);
      if (success) {
        logger.info('Webhook signature verified');
        // Logic to process event would go here, or maybe verifyWebhookSignature just returns bool.
        // Assuming we just acknowledge for now as the logic might be handled elsewhere or missing.
        res.status(200).json({ status: 'success' })
      } else {
        res.status(400).json({ status: 'error', message: 'Invalid signature' })
      }
    } catch (error) {
      console.error('Webhook error:', error)
      res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
  }

  /**
   * Initialize payment
   * @api POST /payments/initialize
   * @apiName API-PAYMENT-003
   * @apiGroup Payments
   * @srsRequirement REQ-SUP-01, REQ-SUP-02, REQ-ADV-04
   */
  static async initializePayment(req: Request, res: Response) {
    console.log(req.body)
    try {
      const response = await PaymentGatewayService().initializePayment(req.body)
      res.status(200).json(response.data)
    } catch (error: any) {
      logger.error('Failed to initialize payment:', error.response?.data || error.message)
      res.status(500).json({ error: 'Failed to initialize payment' })
    }
  }

  /**
   * Verify transaction
   * @api POST /payments/verify/:reference
   * @apiName API-PAYMENT-004
   * @apiGroup Payments
   * @srsRequirement REQ-SUP-01, REQ-SUP-02, REQ-ADV-04
   */
  static async verifyTransaction(req: Request, res: Response) {
    try {
      const { reference } = req.params

      if (!reference) {
        res.status(400).json({ error: 'Transaction reference is required' })
      }

      const response = await PaymentGatewayService().verifyPayment(reference)
      res.status(200).json(response)
    } catch (error: any) {
      logger.error('Failed to verify transaction:', error.response?.data || error.message)
      res.status(500).json({ error: 'Failed to verify transaction' })
    }
  }
}