"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSeeder = void 0;
const Player_1 = require("@models/Player");
const logger_1 = __importDefault(require("../../utils/logger"));
const player_1 = require("../data/development/player");
const players_1 = require("../data/production/players");
const players_2 = require("../data/testing/players");
const base_seeder_1 = require("./base-seeder");
class PlayerSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(Player_1.Player, 'player');
    }
    async getData(environment) {
        logger_1.default.info(`Loading ${this.name} data for ${environment} environment`);
        switch (environment) {
            case 'production':
                return await this.getProductionData();
            case 'test':
                return this.getTestData();
            case 'development':
            default:
                return this.getDevelopmentData();
        }
    }
    async getProductionData() {
        try {
            return players_1.productionPlayers || [];
        }
        catch (error) {
            logger_1.default.warn(`No production data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getTestData() {
        try {
            return players_2.testPlayers || [];
        }
        catch (error) {
            logger_1.default.warn(`No test data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    getDevelopmentData() {
        try {
            return player_1.developmentPlayers || [];
        }
        catch (error) {
            logger_1.default.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
    async seed(options = {}) {
        return super.seed(options);
    }
}
exports.PlayerSeeder = PlayerSeeder;
//# sourceMappingURL=player-seeder.js.map