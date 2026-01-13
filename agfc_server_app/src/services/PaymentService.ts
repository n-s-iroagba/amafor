// ../services/PaymentService.ts

import { AdSubscriptionPayment, PaymentStatus } from "../models/AdSubscriptionPayment"
import EmailService from "./EmailService"
import { ReceiptService } from "./ReceiptService"
import { SubscriptionService } from "./SubscriptionService"
import AdSubscriptionPaymentRepository from "../repositories/PaymentRepository"
import { NotFoundError } from "../utils/errors"
import { Advertiser } from "../models/Advertiser"
import User from "../models/User"


export class PaymentService {

  private static emailService = new EmailService('d')
  private static receiptService = new ReceiptService()
  private static subscriptionService = new SubscriptionService()
  private static paymentRepository = new AdSubscriptionPaymentRepository()

  static async getPaymentSubscriptionId(subscription_id: number): Promise<AdSubscriptionPayment[]> {
    try {
      return await this.paymentRepository.findAdSubscriptionPaymentsBysubscriptionId(subscription_id)
    } catch (error) {
      console.error(error)
      throw error
    }
  }



  /**
   * Get payments within a date range with pagination
   */
  static async getPaymentsByDateRange(
    startDate: Date,
    endDate: Date,
    page = 1,
    limit = 10
  ): Promise<AdSubscriptionPayment[]> {
    try {
      const offset = (page - 1) * limit
      return await this.paymentRepository.findAdSubscriptionPaymentsByDateRange(startDate, endDate, limit, offset)
    } catch (error) {
      console.error
      throw  error
    }
  }

  static async handleSuccessfulPayment(reference: string, paidAt: string): Promise<void> {
    try {
      // Check if payment exists
      const paymentExists = await this.paymentRepository.AdSubscriptionPaymentExists(reference)
      if (!paymentExists) {
        throw new NotFoundError('Payment not found')
      }

      // Update payment status
      const updates = {
        paidAt: new Date(paidAt),
        status: PaymentStatus.PAID,
      }

      const payment = await this.paymentRepository.updateAdSubscriptionPaymentByReference(reference, updates)

      if (!payment) {
        throw new NotFoundError('Payment not found')
      }

      // Create initial application
      const a = await this.subscriptionService.createSubscription({
    advertiserId:payment.advertiserId,
       adPlanId: payment.adPlanId,
      })

      // Get advertiser details
    
  const advertiser = await Advertiser.findByPk(payment.advertiserId)
      if (!advertiser) {
        throw new NotFoundError('advertiser not found')
      }

const user = await User.findByPk(advertiser.userId)
 if (!user) {
        throw new NotFoundError('user not found')
      }
      // Generate receipt
      const receiptData = await this.receiptService.generateReceipt(payment)


      // Send receipt email
      await this.emailService.sendReceiptEmail({
        to: user.email,
        advertiserName: advertiser.contactName,
        payment,
        receiptData,
      })

     
    } catch (error) {
        console.error(error)
   
      throw error
    }
  }



  static async handleFailedPayment(reference: string, event: string): Promise<void> {
    try {
      // Check if payment exists
      const paymentExists = await this.paymentRepository.AdSubscriptionPaymentExists(reference)
      if (!paymentExists) {
        throw new NotFoundError('Payment not found')
      }

      // Update payment status
      const updates = {
        status: PaymentStatus.FAILED,
      }

   
      const payment = await this.paymentRepository.updateAdSubscriptionPaymentByReference(reference, updates)

      if (!payment) {
        throw new NotFoundError('Payment not found')
      }


     
  const advertiser = await Advertiser.findByPk(payment.advertiserId)
      if (!advertiser) {
        throw new NotFoundError('advertiser not found')
      }

const user = await User.findByPk(advertiser.userId)
 if (!user) {
        throw new NotFoundError('user not found')
      }
      // Generate receipt
      const receiptData = await this.receiptService.generateReceipt(payment)
      // Send failure notification email
      await this.emailService.sendFailedPaymentEmail({
        to: user.email,
        advertiserName: advertiser.contactName,
        payment,
        failureReason: event,
      })

  
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}