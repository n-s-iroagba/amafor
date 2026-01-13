// src/repositories/AdSubscriptionPaymentRepository.ts

import { Op } from 'sequelize'


import BaseRepository from './BaseRepository'
import { AdSubscriptionPayment } from '../models/AdSubscriptionPayment'



class AdSubscriptionPaymentRepository extends BaseRepository<AdSubscriptionPayment> {
  constructor() {
    super(AdSubscriptionPayment)
  }

  async createAdSubscriptionPayment(data:any): Promise<AdSubscriptionPayment> {
    return await this.create(data)
  }

  async findAdSubscriptionPaymentsBysubscriptionId(subscription_id: number): Promise<AdSubscriptionPayment[]> {
    const result = await this.findAll({
      where: { subscriptionId:subscription_id },
    })
    return result.data
  }

 
  async findAdSubscriptionPaymentsByDateRange(
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number
  ): Promise<AdSubscriptionPayment[]> {
    const where = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    }

    const options: any = { where }
    if (limit) options.limit = limit
    if (offset) options.offset = offset

    const result = await this.findAll(options)
    return result.data
  }

  async findAdSubscriptionPaymentByReference(reference: string): Promise<AdSubscriptionPayment | null> {
    return await this.findOne({ reference })
  }

  async updateAdSubscriptionPaymentByReference(reference: string, updates: Partial<AdSubscriptionPayment>): Promise<AdSubscriptionPayment | null> {
    return await this.updateWhere({ reference }, updates)
  }

  async updateAdSubscriptionPaymentById(id: number, updates: Partial<AdSubscriptionPayment>): Promise<AdSubscriptionPayment | null> {
    return await this.updateById(id, updates)
  }

  async AdSubscriptionPaymentExists(reference: string): Promise<boolean> {
    const AdSubscriptionPayment = await this.findAdSubscriptionPaymentByReference(reference)
    return !!AdSubscriptionPayment
  }
}

export default  AdSubscriptionPaymentRepository