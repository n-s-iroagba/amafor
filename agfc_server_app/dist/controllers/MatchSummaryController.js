"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSummaryController = void 0;
const MatchSummaryService_1 = require("../services/MatchSummaryService");
class MatchSummaryController {
    constructor() {
        this.createMatchSummary = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.createMatchSummary(req.body);
                res.status(201).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMatchSummary = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.getMatchSummaryById(parseInt(req.params.id));
                res.status(200).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMatchSummaryByFixture = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.getMatchSummaryByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateMatchSummary = async (req, res, next) => {
            try {
                const summary = await this.matchSummaryService.updateMatchSummary(parseInt(req.params.id), req.body);
                res.status(200).json(summary);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteMatchSummary = async (req, res, next) => {
            try {
                await this.matchSummaryService.deleteMatchSummary(parseInt(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.matchSummaryService = new MatchSummaryService_1.MatchSummaryService();
    }
}
exports.MatchSummaryController = MatchSummaryController;
//# sourceMappingURL=MatchSummaryController.js.map