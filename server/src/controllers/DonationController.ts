import { Request, Response, NextFunction } from 'express';
import { DonationService } from '../services';

export class DonationController {
  private donationService: DonationService;

  constructor() {
    this.donationService = new DonationService();
  }

  public initiateDonation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, email, metadata } = req.body;
      const result = await this.donationService.initiateDonation(amount, email, metadata);
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      await this.donationService.processWebhook(req.body, signature);
      
      res.status(200).send('Webhook received');
    } catch (error) {
      // Don't expose internal errors to webhook caller, just log
      next(error);
    }
  };

  public getDonorWall = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donors = await this.donationService.getDonorWall(10);
      res.status(200).json({ success: true, data: donors });
    } catch (error) {
      next(error);
    }
  };

  public listDonations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donations = await this.donationService.listDonations(req.query);
      res.status(200).json({ success: true, data: donations });
    } catch (error) {
      next(error);
    }
  };
}