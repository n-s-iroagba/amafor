export declare class SystemService {
    private notificationRepo;
    constructor();
    getHealthStatus(): Promise<any>;
    createNotification(title: string, message: string, type: string, severity: string, targetUserId?: string): Promise<import("../models/SystemNotification").SystemNotification>;
}
//# sourceMappingURL=SystemService.d.ts.map