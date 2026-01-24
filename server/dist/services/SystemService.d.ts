export declare class SystemService {
    private notificationRepo;
    private auditRepo;
    constructor();
    getHealthStatus(): Promise<any>;
    createNotification(title: string, message: string, type: string, severity: string, targetUserId?: string): Promise<import("../models").SystemNotification>;
    getSystemConfig(): Promise<{
        maintenanceMode: boolean;
        scoutRegistration: boolean;
        rateLimit: number;
        sessionTimeout: number;
        logLevel: string;
        appVersion: string;
    }>;
    updateSystemConfig(config: any, adminId: string): Promise<any>;
    getAuditLogs(query: any): Promise<import("../models").AuditLog[]>;
    listBackups(): Promise<{
        id: string;
        name: string;
        size: string;
        date: Date;
    }[]>;
    createBackup(): Promise<{
        id: string;
        name: string;
        status: string;
    }>;
    restoreBackup(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteBackup(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    downloadBackup(id: string): Promise<{
        url: string;
    }>;
    getDatabaseHealth(): Promise<{
        status: string;
        message: any;
    }>;
    getRedisHealth(): Promise<{
        status: string;
        message: any;
    }>;
    runDiagnostic(): Promise<{
        status: string;
        issues: never[];
        duration: number;
    }>;
}
//# sourceMappingURL=SystemService.d.ts.map