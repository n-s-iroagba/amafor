"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreativeController = void 0;
const AdCreativeService_1 = require("../services/AdCreativeService");
const logger_1 = __importDefault(require("../utils/logger"));
const tracer_1 = __importDefault(require("../utils/tracer"));
class AdCreativeController {
    constructor() {
        this.adCreativeService = new AdCreativeService_1.AdCreativeService();
    }
    /**
     * Get all Ad Creatives
     * @api GET /ad-creatives
     * @apiName API-ADV-006
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    async getAllAdCreatives(req, res, next) {
        return tracer_1.default.startActiveSpan('controller.AdCreativeController.getAllAdCreatives', async (span) => {
            try {
                const creatives = await this.adCreativeService.getAllAdCreatives();
                span.setAttribute('count', creatives.length);
                res.status(200).json({
                    success: true,
                    data: creatives
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('CONTROLLER_GET_ALL_CREATIVES_ERROR', { error: error.message });
                next(error);
            }
            finally {
                span.end();
            }
        });
    }
    /**
     * Create Ad Creative
     * @api POST /ad-creatives
     * @apiName API-ADV-007
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    async createAdCreative(req, res, next) {
        return tracer_1.default.startActiveSpan('controller.AdCreativeController.createAdCreative', async (span) => {
            try {
                // Validation handled by middleware
                const data = req.body;
                const creative = await this.adCreativeService.createAdCreative(data);
                span.setAttributes({
                    creativeId: creative.id,
                    campaignId: creative.campaignId
                });
                res.status(201).json({
                    success: true,
                    data: creative,
                    message: 'Ad creative created successfully'
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('CONTROLLER_CREATE_CREATIVE_ERROR', { error: error.message });
                next(error);
            }
            finally {
                span.end();
            }
        });
    }
    /**
     * Get Ad Creative By ID
     * @api GET /ad-creatives/:id
     * @apiName API-ADV-008
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    async getAdCreativeById(req, res, next) {
        return tracer_1.default.startActiveSpan('controller.AdCreativeController.getAdCreativeById', async (span) => {
            try {
                const { id } = req.params;
                span.setAttribute('creativeId', id);
                const creative = await this.adCreativeService.getAdCreativeById(id);
                if (!creative) {
                    res.status(404).json({
                        success: false,
                        message: 'Ad creative not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: creative
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('CONTROLLER_GET_CREATIVE_BY_ID_ERROR', { error: error.message, id: req.params.id });
                next(error);
            }
            finally {
                span.end();
            }
        });
    }
    /**
     * Update Ad Creative
     * @api PUT /ad-creatives/:id
     * @apiName API-ADV-009
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    async updateAdCreative(req, res, next) {
        return tracer_1.default.startActiveSpan('controller.AdCreativeController.updateAdCreative', async (span) => {
            try {
                const { id } = req.params;
                // Validation handled by middleware
                const updates = req.body;
                span.setAttribute('creativeId', id);
                const updatedCreative = await this.adCreativeService.updateAdCreative(id, updates);
                if (!updatedCreative) {
                    res.status(404).json({
                        success: false,
                        message: 'Ad creative not found or no changes made'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: updatedCreative,
                    message: 'Ad creative updated successfully'
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('CONTROLLER_UPDATE_CREATIVE_ERROR', { error: error.message, id: req.params.id });
                next(error);
            }
            finally {
                span.end();
            }
        });
    }
    /**
     * Delete Ad Creative
     * @api DELETE /ad-creatives/:id
     * @apiName API-ADV-010
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    async deleteAdCreative(req, res, next) {
        return tracer_1.default.startActiveSpan('controller.AdCreativeController.deleteAdCreative', async (span) => {
            try {
                const { id } = req.params;
                span.setAttribute('creativeId', id);
                const deleted = await this.adCreativeService.deleteAdCreative(id);
                if (!deleted) {
                    res.status(404).json({
                        success: false,
                        message: 'Ad creative not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Ad creative deleted successfully'
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('CONTROLLER_DELETE_CREATIVE_ERROR', { error: error.message, id: req.params.id });
                next(error);
            }
            finally {
                span.end();
            }
        });
    }
}
exports.AdCreativeController = AdCreativeController;
//# sourceMappingURL=AdCreativeController.js.map