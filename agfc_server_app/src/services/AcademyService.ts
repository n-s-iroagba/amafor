import { AcademyRepository } from '../repositories'; // Assuming Generic Repository
import { AuditService } from './AuditService';
import { Application, NewsItem } from '../models'; // Assuming models exist
import { structuredLogger, tracer } from '../utils';

export class AcademyService {
  private academyRepository: AcademyRepository;
  private auditService: AuditService;

  constructor() {
    this.academyRepository = new AcademyRepository();
    this.auditService = new AuditService();
  }

  public async getNews(filters: any): Promise<NewsItem[]> {
    return tracer.startActiveSpan('service.AcademyService.getNews', async (span) => {
      try {
        return await this.academyRepository.findNews(filters);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async submitApplication(data: any): Promise<Application> {
    return tracer.startActiveSpan('service.AcademyService.submitApplication', async (span) => {
      try {
        const application = await this.academyRepository.createApplication({
          ...data,
          status: 'PENDING',
          appliedAt: new Date()
        });

        structuredLogger.business('TRIAL_APPLICATION_SUBMITTED', 0, 'public_user', { applicationId: application.id });
        
        return application;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async listApplications(filters: any): Promise<Application[]> {
    return tracer.startActiveSpan('service.AcademyService.listApplications', async (span) => {
      try {
        return await this.academyRepository.findApplications(filters);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async updateStatus(applicationId: string, status: string, notes: string, adminId: string): Promise<Application> {
    return tracer.startActiveSpan('service.AcademyService.updateStatus', async (span) => {
      try {
        const [affected, updatedApps] = await this.academyRepository.updateApplication(applicationId, {
          status,
          notes,
          reviewedBy: adminId,
          reviewedAt: new Date()
        });

        if (!affected) throw new Error('Application not found');

        await this.auditService.logAction({
          userId: adminId,
          userEmail: 'admin',
          userType: 'admin',
          action: 'UPDATE_STATUS',
          entityType: 'ACADEMY_APP',
          entityId: applicationId,
          entityName: `Application ${applicationId}`,
          changes: [{ field: 'status', newValue: status }],
          ipAddress: '0.0.0.0',
          metadata: { notes }
        });

        structuredLogger.business('TRIAL_STATUS_CHANGED', 0, adminId, { applicationId, status });

        return updatedApps[0];
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}