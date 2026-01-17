import { Application, NewsItem } from '../models';
export declare class AcademyService {
    private academyRepository;
    private auditService;
    constructor();
    getNews(filters: any): Promise<NewsItem[]>;
    submitApplication(data: any): Promise<Application>;
    listApplications(filters: any): Promise<Application[]>;
    updateStatus(applicationId: string, status: string, notes: string, adminId: string): Promise<Application>;
}
//# sourceMappingURL=AcademyService.d.ts.map