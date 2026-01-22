"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerLeagueStatisticsSeeder = void 0;
// seeders/PlayerLeagueStatisticsSeeder.ts
const PlayerLeagueStatistics_1 = __importDefault(require("@models/PlayerLeagueStatistics"));
const logger_1 = __importDefault(require("../../utils/logger"));
const playerLeagueStatistics_1 = require("../data/development/playerLeagueStatistics");
const base_seeder_1 = require("./base-seeder");
class PlayerLeagueStatisticsSeeder extends base_seeder_1.BaseSeeder {
    constructor() {
        super(PlayerLeagueStatistics_1.default, 'player_league_statistics');
    }
    async getData(environment) {
        logger_1.default.info(`Loading ${this.name} data for ${environment} environment`);
        switch (environment) {
            case 'production':
                return [];
            case 'test':
                return [];
            case 'development':
            default:
                return this.getDevelopmentData();
        }
    }
    getDevelopmentData() {
        try {
            return playerLeagueStatistics_1.developmentPlayerLeagueStatistics || [];
        }
        catch (error) {
            logger_1.default.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
}
exports.PlayerLeagueStatisticsSeeder = PlayerLeagueStatisticsSeeder;
//# sourceMappingURL=player-league-statistics.js.map