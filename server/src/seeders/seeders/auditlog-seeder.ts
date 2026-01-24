
import { AuditLog } from '../../models/AuditLog';
import { AuditLogAttributes } from '../../models/AuditLog';
import logger from '../../utils/logger';
import { developmentAuditLogs } from '../data/development/auditlogs';
import { productionAuditLogs } from '../data/production/auditlogs';
import { testAuditLogs } from '../data/testing/auditlogs';
import { BaseSeeder } from './base-seeder';

export class AuditLogSeeder extends BaseSeeder<AuditLog> {
  constructor() {
    super(AuditLog, 'auditlog');
  }

  async getData(environment: string): Promise<AuditLogAttributes[]> {
    logger.info(`Loading ${this.name} data for ${environment} environment`);

    switch (environment) {
      case 'production':
        return await this.getProductionData();
      case 'test':
        return this.getTestData();
      case 'development':
      default:
        return this.getDevelopmentData();
    }
  }

  private async getProductionData(): Promise<AuditLogAttributes[]> {
    try {
      return productionAuditLogs || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): AuditLogAttributes[] {
    try {
      return testAuditLogs || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): AuditLogAttributes[] {
    try {
      return developmentAuditLogs || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
