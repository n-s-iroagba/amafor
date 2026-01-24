import { NextFunction, Request, Response } from 'express';
import { AdCreativeService } from '../services/AdCreativeService';
import logger from '../utils/logger';
import tracer from '../utils/tracer';

export class AdCreativeController {
    private adCreativeService: AdCreativeService;

    constructor() {
        this.adCreativeService = new AdCreativeService();
    }

    /**
     * Get all Ad Creatives
     * @api GET /ad-creatives
     * @apiName API-ADV-006
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    async getAllAdCreatives(req: Request, res: Response, next: NextFunction): Promise<void> {
        return tracer.startActiveSpan('controller.AdCreativeController.getAllAdCreatives', async (span) => {
            try {
                const creatives = await this.adCreativeService.getAllAdCreatives();
                span.setAttribute('count', creatives.length);

                res.status(200).json({
                    success: true,
                    data: creatives
                });
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                logger.error('CONTROLLER_GET_ALL_CREATIVES_ERROR', { error: error.message });
                next(error);
            } finally {
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
    async createAdCreative(req: Request, res: Response, next: NextFunction): Promise<void> {
        return tracer.startActiveSpan('controller.AdCreativeController.createAdCreative', async (span) => {
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
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                logger.error('CONTROLLER_CREATE_CREATIVE_ERROR', { error: error.message });
                next(error);
            } finally {
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
    async getAdCreativeById(req: Request, res: Response, next: NextFunction): Promise<void> {
        return tracer.startActiveSpan('controller.AdCreativeController.getAdCreativeById', async (span) => {
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
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                logger.error('CONTROLLER_GET_CREATIVE_BY_ID_ERROR', { error: error.message, id: req.params.id });
                next(error);
            } finally {
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
    async updateAdCreative(req: Request, res: Response, next: NextFunction): Promise<void> {
        return tracer.startActiveSpan('controller.AdCreativeController.updateAdCreative', async (span) => {
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
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                logger.error('CONTROLLER_UPDATE_CREATIVE_ERROR', { error: error.message, id: req.params.id });
                next(error);
            } finally {
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
    async deleteAdCreative(req: Request, res: Response, next: NextFunction): Promise<void> {
        return tracer.startActiveSpan('controller.AdCreativeController.deleteAdCreative', async (span) => {
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
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                logger.error('CONTROLLER_DELETE_CREATIVE_ERROR', { error: error.message, id: req.params.id });
                next(error);
            } finally {
                span.end();
            }
        });
    }

    /**
     * Get Creatives by Campaign ID
     * @api GET /campaigns/:id/creatives
     * @apiName API-ADV-011
     * @apiGroup Advertising
     * @srsRequirement REQ-ADV-07
     */
    async getCreativesByCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
        return tracer.startActiveSpan('controller.AdCreativeController.getCreativesByCampaign', async (span) => {
            try {
                const { id } = req.params;
                span.setAttribute('campaignId', id);

                const creatives = await this.adCreativeService.getAdCreativesByCampaign(id);

                res.status(200).json({
                    success: true,
                    data: creatives
                });
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                logger.error('CONTROLLER_GET_CAMPAIGN_CREATIVES_ERROR', { error: error.message, campaignId: req.params.id });
                next(error);
            } finally {
                span.end();
            }
        });
    }
}