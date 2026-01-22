"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureSummaryController = void 0;
const FixtureSummaryService_1 = require("../services/FixtureSummaryService");
class FixtureSummaryController {
    constructor() {
        /**
         * Create match summary
         * @api POST /match-summary
         * @apiName API-SUMMARY-001
         * @apiGroup Fixture Summary
         * @srsRequirement REQ-ADM-03
         */
        this.createFixtureSummary = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.createFixtureSummary(req.body);
                res.status(201).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        this.getFixtureSummary = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.getFixtureSummaryById(parseInt(req.params.id));
                res.status(200).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get summary for fixture
         * @api GET /match-summary/fixture/:fixtureId
         * @apiName API-SUMMARY-002
         * @apiGroup Fixture Summary
         * @srsRequirement REQ-PUB-01
         */
        this.getFixtureSummaryByFixture = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.getFixtureSummaryByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update summary
         * @api PUT /match-summary/:id
         * @apiName API-SUMMARY-003
         * @apiGroup Fixture Summary
         * @srsRequirement REQ-ADM-03
         */
        this.updateFixtureSummary = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.updateFixtureSummary(parseInt(req.params.id), req.body);
                res.status(200).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete summary
         * @api DELETE /match-summary/:id
         * @apiName API-SUMMARY-004
         * @apiGroup Fixture Summary
         * @srsRequirement REQ-ADM-03
         */
        this.deleteFixtureSummary = async (req, res, next) => {
            try {
                await this.matchSummaryService.deleteFixtureSummary(parseInt(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.matchSummaryService = new FixtureSummaryService_1.FixtureSummaryService();
    }
}
exports.FixtureSummaryController = FixtureSummaryController;
//# sourceMappingURL=FixtureSummaryController.js.map