import { Request, Response, NextFunction } from 'express';
import { SystemService } from '../services';

export class SystemController {
  private systemService: SystemService;

  constructor() {
    this.systemService = new SystemService();
  }

  /**
   * Get system configuration
   * @api GET /system/config
   * @apiName API-SYSTEM-001
   * @apiGroup System
   * @srsRequirement REQ-ADM-01
   */
  public getConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await this.systemService.getSystemConfig();
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update system configuration
   * @api PATCH /system/config
   * @apiName API-SYSTEM-002
   * @apiGroup System
   * @srsRequirement REQ-ADM-01
   */
  public updateConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = (req as any).user.id;
      const config = await this.systemService.updateSystemConfig(req.body, adminId);
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get audit logs
   * @api GET /system/audit
   * @apiName API-SYSTEM-003
   * @apiGroup System
   * @srsRequirement REQ-ADM-08
   */
  public getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.systemService.getAuditLogs(req.query);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  };

  /**
   * List system backups
   * @api GET /system/backups
   * @apiName API-SYSTEM-004
   * @apiGroup System
   * @srsRequirement REQ-ADM-01
   */
  public listBackups = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const backups = await this.systemService.listBackups();
      res.status(200).json({ success: true, data: backups });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create system backup
   * @api POST /system/backups
   */
  public createBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.systemService.createBackup();
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Restore system backup
   * @api POST /system/backups/:id/restore
   */
  public restoreBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.systemService.restoreBackup(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete system backup
   * @api DELETE /system/backups/:id
   */
  public deleteBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.systemService.deleteBackup(id);
      res.status(200).json({ success: true, message: 'Backup deleted' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Download system backup
   * @api GET /system/backups/:id/download
   */
  public downloadBackup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.systemService.downloadBackup(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Health check
   * @api GET /health
   * @apiName API-HEALTH-001
   * @apiGroup Health
   * @srsRequirement REQ-ADM-09
   */
  public getHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await this.systemService.getHealthStatus();
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Database health check
   * @api GET /health/db
   * @apiName API-HEALTH-002
   * @apiGroup Health
   * @srsRequirement REQ-ADM-09
   */
  public getDatabaseHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await this.systemService.getDatabaseHealth();
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Redis health check
   * @api GET /health/redis
   * @apiName API-HEALTH-003
   * @apiGroup Health
   * @srsRequirement REQ-ADM-09
   */
  public getRedisHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await this.systemService.getRedisHealth();
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  };
  /**
   * Run system diagnostic
   * @api POST /system/diagnostic
   */
  public runDiagnostic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.systemService.runDiagnostic();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}