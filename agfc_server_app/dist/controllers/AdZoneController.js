"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdZoneController = void 0;
const AdZoneService_1 = require("@services/AdZoneService");
const logger_1 = __importDefault(require("@utils/logger"));
class AdZoneController {
    constructor() {
        this.adZoneService = new AdZoneService_1.AdZoneService();
    }
    async getAllZones(req, res) {
        try {
            const zones = await this.adZoneService.getAllZones();
            res.status(200).json({
                success: true,
                data: zones,
                count: zones.length
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get all zones', { error: error.message });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to get zones'
            });
        }
    }
    async getActiveZones(req, res) {
        try {
            const zones = await this.adZoneService.getActiveZones();
            res.status(200).json({
                success: true,
                data: zones,
                count: zones.length
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get active zones', { error: error.message });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to get active zones'
            });
        }
    }
    async getZoneByType(req, res) {
        try {
            const { zone } = req.params;
            const zoneData = await this.adZoneService.getZoneByType(zone);
            res.status(200).json({
                success: true,
                data: zoneData
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get zone by type', {
                zone: req.params.zone,
                error: error.message
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to get zone'
            });
        }
    }
    async updateZonePrice(req, res) {
        try {
            const { zone } = req.params;
            const { pricePerView } = req.body;
            const updatedBy = req.user.id;
            if (!pricePerView || pricePerView < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid pricePerView is required (minimum 1)'
                });
            }
            const data = {
                zone: zone,
                pricePerView,
                updatedBy
            };
            const updatedZone = await this.adZoneService.updateZonePrice(data);
            res.status(200).json({
                success: true,
                message: 'Zone price updated successfully',
                data: updatedZone
            });
        }
        catch (error) {
            logger_1.default.error('Failed to update zone price', {
                zone: req.params.zone,
                error: error.message
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to update zone price'
            });
        }
    }
    async calculateCampaignCost(req, res) {
        try {
            const { zone } = req.params;
            const { impressions } = req.body;
            if (!impressions || impressions < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid impressions count is required (minimum 1)'
                });
            }
            const cost = await this.adZoneService.calculateCampaignCost(zone, parseInt(impressions));
            res.status(200).json({
                success: true,
                data: cost
            });
        }
        catch (error) {
            logger_1.default.error('Failed to calculate campaign cost', {
                zone: req.params.zone,
                impressions: req.body.impressions,
                error: error.message
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to calculate campaign cost'
            });
        }
    }
    async getZoneStats(req, res) {
        try {
            const stats = await this.adZoneService.getZoneStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get zone stats', { error: error.message });
            res.status(500).json({
                success: false,
                message: 'Failed to get zone stats'
            });
        }
    }
    async findBestZoneForBudget(req, res) {
        try {
            const { budget, impressions } = req.body;
            if (!budget || budget < 1 || !impressions || impressions < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid budget and impressions are required'
                });
            }
            const result = await this.adZoneService.getBestZoneForBudget(parseFloat(budget), parseInt(impressions));
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'No suitable zone found for the given budget and impressions'
                });
            }
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            logger_1.default.error('Failed to find best zone for budget', {
                budget: req.body.budget,
                impressions: req.body.impressions,
                error: error.message
            });
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to find best zone'
            });
        }
    }
}
exports.AdZoneController = AdZoneController;
//# sourceMappingURL=AdZoneController.js.map