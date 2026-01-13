import axios, { AxiosResponse } from 'axios'



import PaymentRepository from '../repositories/PaymentRepository'

import userRepository from '../repositories/UserRepository'
import {
  ClientPaymentInitializationPayload,
  PaystackVerificationResponse,
  PaystackWebhookEvent,
} from '../types/paymentGateway.types'
import { NotFoundError, } from '../utils/errors'

import { PaymentService } from './PaymentService'
import { AdSubscriptionPayment, PaymentStatus } from '../models/AdSubscriptionPayment'
import PaymentGatewayHelpers from '../utils/helpers/paymentGateway.helpers'
import { Advertiser } from '../models/Advertiser'
import User from '../models/User'
import { AdPlan } from '../models/AdPlan'
import { Subscription } from '../models/Subscription'
const PAYSTACK_BASE_URL = 'https://api.paystack.co'
const PAYSTACK_KEY =
  process.env.PAYSTACK_SECRET_KEY || 'sk_test_afebde26ed66d974615c5b212af460dbdde8507d'

export default class PaymentGatewayService {
  static async initializePayment(data: ClientPaymentInitializationPayload): Promise<AxiosResponse> {
    try {

      const advertiser:any = await Advertiser.findOne({where:{
        userId:data.advertiserId
      }})
       const user = await User.findByPk(data.advertiserId)
      if(!advertiser||!user){
        throw new NotFoundError('Advertiser not found')
      }
       const adPlan = await AdPlan.findByPk(data.adPlanId)
       if(!adPlan){
        throw new NotFoundError('advertisment plan not found')
      }
       const subscription = await Subscription.create({
        adPlanId:data.adPlanId,
        advertiserId:advertiser.id,
        status:'PENDING'

      })

      const payload = PaymentGatewayHelpers.buildInitializePaymentPayload(
        user.email,
        advertiser.contactName,
        adPlan?.price,
        subscription.id,
        data
      )
     
      const response = await this.makePaystackRequest('POST', '/transaction/initialize', payload)
    
      const paymentData = {
     
        adPlanId: data.adPlanId,
        advertiserId: data.advertiserId,
        amountPaid: adPlan.price,
        reference: response.data.data.reference,
        subscriptionId:subscription.id,
        
  
        status: PaymentStatus.PENDING,
      }
      if (response.data) {
       const a = await AdSubscriptionPayment.create(paymentData)
       console.log(a)
      }
      return response.data
    } catch (error) {
        console.error(error)
        throw error

    }
  }

  static async makePaystackRequest<T = any>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any
  ): Promise<AxiosResponse<T>> {
    const config = {
      method,
      url: `${PAYSTACK_BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        'Content-Type': 'application/json',
      },
      ...(data && { data }),
    }

    return await axios(config)
  }

  static async verifyTransaction(reference: string): Promise<PaystackVerificationResponse> {
    try {
      const response = await this.makePaystackRequest<PaystackVerificationResponse>(
        'GET',
        `/transaction/verify/${reference}`
      )

      const { status, data: responseData } = response.data
      console.log(response.data)

      if (status) {
        await PaymentService.handleSuccessfulPayment(reference, responseData.paid_at)
      }

      return response.data
    } catch (error) {
        console.error(error)
        throw error
  
    }
  }

  static async processEvent(payload: PaystackWebhookEvent): Promise<boolean> {
    const { event, data: responseData } = payload

    try {
      const reference = responseData.reference

      if (event === 'charge.success') {
        await PaymentService.handleSuccessfulPayment(responseData.reference, responseData.paid_at)
        return true
      } else {
        await PaymentService.handleFailedPayment(reference, event)
        return false
      }
    } catch (error) {
        console.error(error)
        throw error
    
    }
  }
}