"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const services_1 = require("../services");
class PlayerController {
    constructor() {
        this.createPlayer = async (req, res, next) => {
            try {
                const creatorId = req.user.id;
                const player = await this.playerService.createPlayer(req.body, creatorId);
                res.status(201).json({
                    success: true,
                    data: player
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getPlayerProfile = async (req, res, next) => {
            try {
                const { id } = req.params;
                const viewerId = req.user?.id;
                const player = await this.playerService.getPlayerProfile(id, viewerId);
                if (!player)
                    throw new Error('Player not found');
                res.status(200).json({
                    success: true,
                    data: player
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.listPlayers = async (req, res, next) => {
            try {
                const players = await this.playerService.listPlayers(req.query);
                res.status(200).json({
                    success: true,
                    results: players.length,
                    data: players
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateStats = async (req, res, next) => {
            try {
                const { id } = req.params;
                const adminId = req.user.id;
                const updatedPlayer = await this.playerService.updatePlayerStats(id, req.body, adminId);
                res.status(200).json({
                    success: true,
                    data: updatedPlayer
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.generateScoutReport = async (req, res, next) => {
            try {
                const { id } = req.params;
                const scoutId = req.user.id;
                const report = await this.playerService.generateScoutReport(id, scoutId);
                res.status(200).json({
                    success: true,
                    data: report
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.playerService = new services_1.PlayerService();
    }
}
exports.PlayerController = PlayerController;
//# sourceMappingURL=PlayerController.js.map