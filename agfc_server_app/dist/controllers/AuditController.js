"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const services_1 = require("../services");
class AuditController {
    constructor() {
        this.getEntityHistory = async (req, res, next) => {
            try {
                const { entityType, entityId } = req.params;
                const { page, limit } = req.query;
                const logs = await this.auditService.getEntityHistory(entityType, entityId, Number(page) || 1, Number(limit) || 20);
                res.status(200).json({ success: true, data: logs });
            }
            catch (error) {
                next(error);
            }
        };
        this.auditService = new services_1.AuditService();
    }
}
exports.AuditController = AuditController;
//# sourceMappingURL=AuditController.js.map