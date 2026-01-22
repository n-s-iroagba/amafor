import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services';

export class AuditController {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  /**
   * Get entity audit history
   * @api GET /audit/:entityType/:entityId
   * @apiName API-AUDIT-001
   * @apiGroup Audit
   * @srsRequirement REQ-AUDIT-01
   */
  public getEntityHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entityType, entityId } = req.params;
      const { page, limit } = req.query;

      const logs = await this.auditService.getEntityHistory(
        entityType,
        entityId,
        Number(page) || 1,
        Number(limit) || 20
      );

      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  };
}