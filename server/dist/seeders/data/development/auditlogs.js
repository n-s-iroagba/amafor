"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentAuditLogs = void 0;
// data/development/audit-log.ts
const AuditLog_1 = require("../../../models/AuditLog");
// IDs from previous steps
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const ARTICLE_ID = 'art1art1-art1-art1-art1-art1art1art1';
// Timestamps relative to now
const ONE_HOUR_AGO = new Date(new Date().setHours(new Date().getHours() - 1));
const THIRTY_MINS_AGO = new Date(new Date().setMinutes(new Date().getMinutes() - 30));
exports.developmentAuditLogs = [
    // 1. Admin Login
    {
        id: 'log1log1-log1-log1-log1-log1log1log1',
        timestamp: ONE_HOUR_AGO,
        userId: ADMIN_USER_ID,
        userEmail: 'admin@academy.com',
        userType: 'super_admin',
        action: AuditLog_1.AuditAction.LOGIN,
        entityType: AuditLog_1.EntityType.USER,
        entityId: ADMIN_USER_ID,
        entityName: 'Super Admin',
        oldValue: null,
        newValue: null,
        ipAddress: '197.210.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
        changes: [],
        metadata: { method: 'password' },
        createdAt: ONE_HOUR_AGO,
        updatedAt: ONE_HOUR_AGO,
    },
    // 2. Creating the Fixture Report Article
    {
        id: 'log2log2-log2-log2-log2-log2log2log2',
        timestamp: THIRTY_MINS_AGO,
        userId: ADMIN_USER_ID,
        userEmail: 'admin@academy.com',
        userType: 'super_admin',
        action: AuditLog_1.AuditAction.CREATE,
        entityType: AuditLog_1.EntityType.ARTICLE,
        entityId: ARTICLE_ID,
        entityName: 'Academy U17s Clinch Thrilling Victory...',
        oldValue: null,
        newValue: { title: 'Academy U17s Clinch Thrilling Victory...', status: 'published' },
        ipAddress: '197.210.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
        changes: [
            { field: 'status', from: null, to: 'published' }
        ],
        metadata: { editor_version: 'quill-2.0' },
        createdAt: THIRTY_MINS_AGO,
        updatedAt: THIRTY_MINS_AGO,
    }
];
//# sourceMappingURL=auditlogs.js.map