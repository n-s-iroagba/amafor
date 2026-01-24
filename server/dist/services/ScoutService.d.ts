export declare class ScoutService {
    private scoutReportRepository;
    private scoutApplicationRepository;
    private playerRepository;
    constructor();
    getReports(filters: any): Promise<any[]>;
    getReportById(id: string): Promise<any>;
    deleteReport(id: string): Promise<boolean>;
    createReport(data: any): Promise<any>;
    submitApplication(data: any): Promise<any>;
}
//# sourceMappingURL=ScoutService.d.ts.map