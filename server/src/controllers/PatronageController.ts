import { Request, Response, NextFunction } from 'express';
import { PatronageService } from '../services'; // Ensure this exports the class you provided
import { structuredLogger } from '../utils';

export class PatronageController {
  private patronageService: PatronageService;

  constructor() {
    this.patronageService = new PatronageService();
  }

  /**
   * Create patron subscription
   * @api POST /patrons/subscribe
   * @apiName API-PATRON-001
   * @apiGroup Patronage
   * @srsRequirement REQ-SUP-02
   */
  public subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { tier, amount } = req.body;

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

  /**
   * List all patrons
   * @api GET /patrons
   * @apiName API-PATRON-002
   * @apiGroup Patronage
   * @srsRequirement REQ-SUP-03, REQ-ADM-10
   */
  public listPatrons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patrons = await this.patronageService.listAllPatrons(req.query);

      res.status(200).json({
        success: true,
        data: patrons
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get patron details
   * @api GET /patrons/:id
   * @apiName API-PATRON-003
   * @apiGroup Patronage
   * @srsRequirement REQ-ADM-10
   */
  /**
   * Get all public patrons
   * @api GET /patrons
   * @apiName API-PATRON-LIST
   * @apiGroup Patronage
   */
  public getPublicPatrons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all active patrons (service/repo defaults to active)
      // The service returns paginated response { data, total, ... }
      const result = await this.patronageService.listAllPatrons(req.query);

      const patrons = result.data || [];

      const transformedPatrons = patrons.map((subscription: any) => {
        // The repository returns PatronSubscription with nested 'patron' (User model)
        // We need to invert this to match Client's PatronWithSubscription: Patron & { subscription: Package }

        const patronData = (subscription as any).patron || {};

        return {
          id: patronData.id || subscription.patronId,
          name: patronData.name || subscription.displayName || 'Anonymous Patron',
          email: '', // Don't expose email publicly
          phoneNumber: '', // Don't expose phone publicly
          imageUrl: patronData.imageUrl || subscription.portraitUrl,
          bio: patronData.bio || subscription.message,
          createdAt: patronData.createdAt,
          updatedAt: patronData.updatedAt,
          subscription: {
            id: subscription.id,
            patronId: subscription.patronId,
            tier: subscription.tier,
            frequency: subscription.frequency,
            amount: subscription.amount,
            status: subscription.status,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            benefits: []
          }
        };
      });

      res.status(200).json({
        success: true,
        data: transformedPatrons
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get top patrons for homepage
   * @api GET /patrons/top
   */
  public getTopPatrons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const patrons = await this.patronageService.getTopPatrons(limit);

      const transformedPatrons = patrons.map(subscription => {
        // The repository returns PatronSubscription with nested 'patron' (User model)
        // We need to invert this to match Client's PatronWithSubscription: Patron & { subscription: Package }

        const patronData = (subscription as any).patron || {};

        return {
          id: patronData.id || subscription.patronId,
          name: patronData.name || subscription.displayName || 'Anonymous Patron',
          email: patronData.email || '',
          phoneNumber: patronData.phoneNumber || '',
          imageUrl: patronData.imageUrl || subscription.portraitUrl,
          bio: patronData.bio || subscription.message,
          createdAt: patronData.createdAt,
          updatedAt: patronData.updatedAt,
          subscription: {
            id: subscription.id,
            patronId: subscription.patronId,
            tier: subscription.tier,
            frequency: subscription.frequency,
            amount: subscription.amount,
            status: subscription.status,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            // Add other necessary fields from subscription package if available, 
            // or mock/default them if the specific 'package' details aren't strictly in the subscription model
            // The client mainly uses tier for display.
            benefits: [] // Populate if available or leave empty
          }
        };
      });

      res.status(200).json({
        success: true,
        data: transformedPatrons
      });
    } catch (error) {
      next(error);
    }
  };

  public getPatronDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const patron = await this.patronageService.getPatronById(id);

      res.status(200).json({
        success: true,
        data: patron
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update patron status
   * @api PATCH /patrons/:id/status
   * @apiName API-PATRON-004
   * @apiGroup Patronage
   * @srsRequirement REQ-ADM-10
   */
  public updatePatronStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const adminId = (req as any).user.id;

      const patron = await this.patronageService.updatePatronStatus(id, status, adminId);

      res.status(200).json({
        success: true,
        message: 'Patron status updated successfully',
        data: patron
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel subscription
   * @api DELETE /patrons/:id
   * @apiName API-PATRON-005
   * @apiGroup Patronage
   * @srsRequirement REQ-ADM-10
   */
  public cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      await this.patronageService.cancelSubscription(id, userId);

      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check subscription status
   * @remarks This is a utility method not in API spec
   */
  public checkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;

      const status = await this.patronageService.checkSubscriptionStatus(userId);

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * List available subscription packages
   * @api GET /patrons/packages
   * @apiName API-PATRON-006
   * @apiGroup Patronage
   */
  public listPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packages = await this.patronageService.getSubscriptionPackages();

      res.status(200).json({
        success: true,
        data: packages
      });
    } catch (error) {
      next(error);
    }
  };

  public createPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pkg = await this.patronageService.createSubscriptionPackage(req.body);
      res.status(201).json({
        success: true,
        data: pkg
      });
    } catch (error) {
      next(error);
    }
  };

  public getPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const pkg = await this.patronageService.getSubscriptionPackage(id);
      res.status(200).json({
        success: true,
        data: pkg
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const pkg = await this.patronageService.updateSubscriptionPackage(id, req.body);
      res.status(200).json({
        success: true,
        data: pkg
      });
    } catch (error) {
      next(error);
    }
  };

  public deletePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.patronageService.deleteSubscriptionPackage(id);
      res.status(200).json({
        success: true,
        message: 'Package deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}