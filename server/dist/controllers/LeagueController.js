"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueController = void 0;
const services_1 = require("../services");
class LeagueController {
    constructor() {
        this.listLeagues = async (req, res, next) => {
            try {
                const leagues = await this.leagueService.getAllLeagues();
                res.status(200).json({ success: true, data: leagues });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLeague = async (req, res, next) => {
            try {
                const { id } = req.params;
                const league = await this.leagueService.getLeagueById(id);
                if (!league) {
                    res.status(404).json({ success: false, message: 'League not found' });
                    return;
                }
                res.status(200).json({ success: true, data: league });
            }
            catch (error) {
                next(error);
            }
        };
        this.createLeague = async (req, res, next) => {
            try {
                const league = await this.leagueService.createLeague(req.body);
                res.status(201).json({ success: true, data: league });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateLeague = async (req, res, next) => {
            try {
                const { id } = req.params;
                const league = await this.leagueService.updateLeague(id, req.body);
                res.status(200).json({ success: true, data: league });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteLeague = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.leagueService.deleteLeague(id);
                res.status(200).json({ success: true, message: 'League deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLeaguesWithTables = async (req, res, next) => {
            try {
                const data = await this.leagueService.getLeaguesWithTables();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLeagueTable = async (req, res, next) => {
            try {
                const { id } = req.params;
                const data = await this.leagueService.getLeagueWithTable(id);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                next(error);
            }
        };
        this.leagueService = new services_1.LeagueService();
    }
}
exports.LeagueController = LeagueController;
//# sourceMappingURL=LeagueController.js.map