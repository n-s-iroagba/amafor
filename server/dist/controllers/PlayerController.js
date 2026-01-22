"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const services_1 = require("../services");
class PlayerController {
    constructor() {
        /**
         * Create a new player
         * @api POST /players
         * @apiName API-PLAYER-003
         * @apiGroup Players
         * @srsRequirement REQ-ADM-04
         */
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
        /**
         * Get player profile by ID
         * @api GET /players/:id
         * @apiName API-PLAYER-002
         * @apiGroup Players
         * @srsRequirement REQ-PUB-05, REQ-SCT-02
         */
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
        /**
         * List all players (public)
         * @api GET /players
         * @apiName API-PLAYER-001
         * @apiGroup Players
         * @srsRequirement REQ-PUB-05, REQ-SCT-02
         */
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
        /**
         * Update player statistics
         * @api PATCH /players/:id/stats
         * @apiName API-PLAYER-004
         * @apiGroup Players
         * @srsRequirement REQ-ADM-04
         */
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
        /**
         * Generate scout report for a player
         * @api GET /players/:id/report
         * @apiName API-PLAYER-005
         * @apiGroup Players
         * @srsRequirement REQ-SCT-04
         */
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