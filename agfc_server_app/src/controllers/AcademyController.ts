import { Request, Response, NextFunction } from 'express';
import { AcademyService } from '../services';
import { structuredLogger } from '../utils';

export class AcademyController {
  private academyService: AcademyService;

  constructor() {
    this.academyService = new AcademyService();
  }

  public getAcademyNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.academyService.getNews(req.query);
      
      res.status(200).json({
        success: true,
        data: news
      });
    } catch (error) {
      next(error);
    }
  };

  public registerTrialist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Public endpoint
      const application = await this.academyService.submitApplication(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Trial application submitted successfully',
        data: { applicationId: application.id }
      });
    } catch (error) {
      next(error);
    }
  };

  public listApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const applications = await this.academyService.listApplications(req.query);
      
      res.status(200).json({
        success: true,
        results: applications.length,
        data: applications
      });
    } catch (error) {
      next(error);
    }
  };

  public updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const adminId = (req as any).user.id;
      
      const result = await this.academyService.updateStatus(id, status, notes, adminId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}