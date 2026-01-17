"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineupController = void 0;
const LineupService_1 = require("../services/LineupService");
class LineupController {
    constructor() {
        this.createLineupPlayer = async (req, res, next) => {
            try {
                const player = await this.lineupService.createLineupPlayer(req.body);
                res.status(201).json(player);
            }
            catch (error) {
                next(error);
            }
        };
        this.getLineupPlayer = async (req, res, next) => {
            try {
                const player = await this.lineupService.getLineupPlayerById(parseInt(req.params.id));
                res.status(200).json(player);
            }
            catch (error) {
                next(error);
            }
        };
        this.getLineupByFixture = async (req, res, next) => {
            try {
                const lineup = await this.lineupService.getLineupByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(lineup);
            }
            catch (error) {
                next(error);
            }
        };
        this.getStartersByFixture = async (req, res, next) => {
            try {
                const starters = await this.lineupService.getStartersByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(starters);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSubstitutesByFixture = async (req, res, next) => {
            try {
                const substitutes = await this.lineupService.getSubstitutesByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(substitutes);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateLineupPlayer = async (req, res, next) => {
            try {
                const player = await this.lineupService.updateLineupPlayer(parseInt(req.params.id), req.body);
                res.status(200).json(player);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteLineupPlayer = async (req, res, next) => {
            try {
                await this.lineupService.deleteLineupPlayer(parseInt(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.batchUpdateLineup = async (req, res, next) => {
            try {
                const lineup = await this.lineupService.batchUpdateLineup(parseInt(req.params.fixtureId), req.body);
                res.status(200).json(lineup);
            }
            catch (error) {
                next(error);
            }
        };
        this.lineupService = new LineupService_1.LineupService();
    }
}
exports.LineupController = LineupController;
//# sourceMappingURL=LineupController.js.map