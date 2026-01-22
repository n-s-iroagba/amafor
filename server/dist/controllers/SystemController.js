"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemController = void 0;
const services_1 = require("../services");
class SystemController {
    constructor() {
        /**
         * Get system configuration
         * @api GET /system/config
         * @apiName API-SYSTEM-001
         * @apiGroup System
         * @srsRequirement REQ-ADM-01
         */
        this.getConfig = async (req, res, next) => {
            try {
                const config = await this.systemService.getSystemConfig();
                res.status(200).json({ success: true, data: config });
            }
            catch (error) {
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
        this.updateConfig = async (req, res, next) => {
            try {
                const adminId = req.user.id;
                const config = await this.systemService.updateSystemConfig(req.body, adminId);
                res.status(200).json({ success: true, data: config });
            }
            catch (error) {
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
        this.getAuditLogs = async (req, res, next) => {
            try {
                const logs = await this.systemService.getAuditLogs(req.query);
                res.status(200).json({ success: true, data: logs });
            }
            catch (error) {
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
        this.listBackups = async (req, res, next) => {
            try {
                const backups = await this.systemService.listBackups();
                res.status(200).json({ success: true, data: backups });
            }
            catch (error) {
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
        this.getHealth = async (req, res, next) => {
            try {
                const status = await this.systemService.getHealthStatus();
                res.status(200).json(status);
            }
            catch (error) {
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
        this.getDatabaseHealth = async (req, res, next) => {
            try {
                const status = await this.systemService.getDatabaseHealth();
                res.status(200).json({ success: true, data: status });
            }
            catch (error) {
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
        this.getRedisHealth = async (req, res, next) => {
            try {
                const status = await this.systemService.getRedisHealth();
                res.status(200).json({ success: true, data: status });
            }
            catch (error) {
                next(error);
            }
        };
        this.systemService = new services_1.SystemService();
    }
}
exports.SystemController = SystemController;
//# sourceMappingURL=SystemController.js.map