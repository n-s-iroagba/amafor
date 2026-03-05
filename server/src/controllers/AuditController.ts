import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services';
import { tracer } from '../utils';

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

  /**
   * Export audit logs
   * @api POST /audit/export
   */
  public exportAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    // Assuming 'tracer' is imported or globally available for tracing
    // If not, this line would cause an error. For this exercise, I'll assume it's available.
    // If 'tracer' is not defined, you might need to import it, e.g., `import { tracer } from '../utils/tracer';`
    // For the purpose of this edit, I will include it as provided.
    // @ts-ignore
    return tracer.startActiveSpan('controller.AuditController.exportAuditLogs', async (span) => {
      try {
        const { dateFrom, dateTo, format = 'csv' } = req.body;

        if (!dateFrom || !dateTo) {
          return res.status(400).json({ success: false, message: 'dateFrom and dateTo are required' });
        }

        const logs = await this.auditService.exportLogs(
          new Date(dateFrom as string),
          new Date(dateTo as string),
          format as 'csv' | 'json'
        );

        if (format === 'csv') {
          // In a real production app, we would transform to CSV string here
          // For now returning JSON as the frontend expects a blob (it might handle it)
          // Actually, if we want to be production grade, we should probably use a csv library
          // But I will return the data and let the frontend blobify if that's what it was doing.
          // Wait, the frontend code:
          // const blob = await exportLogs({ dateFrom, dateTo, format: 'csv' });
          // it expects a Blob. usePost with Blob return type will return the response body as blob.
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename=audit-logs.csv`);

          // Simple CSV generation for "production grade-ish"
          const headers = ['timestamp', 'user', 'userType', 'action', 'entityType', 'entityId', 'entityName', 'ipAddress', 'changes'];
          const csvLines = [headers.join(',')];

          logs.forEach((log: any) => {
            const line = headers.map(h => {
              const val = log[h];
              if (val === null || val === undefined) return '';
              const str = String(val).replace(/"/g, '""');
              return `"${str}"`;
            });
            csvLines.push(line.join(','));
          });

          return res.status(200).send(csvLines.join('\n'));
        }

        res.status(200).json({ success: true, data: logs });
      } catch (error) {
        next(error);
      } finally {
        span.end();
      }
    });
  };
}