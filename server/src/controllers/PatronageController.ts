import { Request, Response, NextFunction } from 'express';
import { PatronageService } from '../services'; // Ensure this exports the class you provided
import { structuredLogger } from '../utils';

export class PatronageController {
  private patronageService: PatronageService;

  constructor() {
    this.patronageService = new PatronageService();
  }

  public subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { tier, amount } = req.body;

      // Service expects: (userId, tier, amount)
      const subscription = await this.patronageService.subscribeUser(userId, tier, amount);

      res.status(201).json({
        success: true,
        message: `Successfully subscribed to ${tier} tier`,
        data: subscription
      });
    } catch (error) {
      next(error);
    }
  };

  public checkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;

      // Service expects: (userId)
      const status = await this.patronageService.checkSubscriptionStatus(userId);

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      next(error);
    }
  };

  // Note: 'cancelSubscription' was not in your provided Service snippet, 
  // so I have omitted it to ensure strict alignment. 
  // If you add it to the Service later, we can add the controller method back.
}