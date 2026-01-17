"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
class MatchService {
    constructor() {
        this.fixtureRepository = new repositories_1.FixtureRepository();
    }
    // Updated: Accepts creatorId to match Controller signature (even if not used extensively yet)
    async createFixture(data, creatorId) {
        return utils_1.tracer.startActiveSpan('service.MatchService.createFixture', async (span) => {
            try {
                const fixture = await this.fixtureRepository.create(data);
                utils_1.structuredLogger.info('Fixture scheduled', { fixtureId: fixture.id, home: data.homeTeam, away: data.awayTeam, creatorId });
                return fixture;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                utils_1.structuredLogger.error('Failed to create fixture', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Renamed: getUpcomingFixtures -> getUpcoming
    async getUpcoming(limit = 5) {
        return utils_1.tracer.startActiveSpan('service.MatchService.getUpcoming', async (span) => {
            try {
                return await this.fixtureRepository.findAll({
                    limit,
                    order: [['matchDate', 'ASC']],
                    where: { status: 'SCHEDULED' }
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Renamed: updateMatchResult -> recordResult
    // Updated signature to accept (id, data, updaterId)
    async recordResult(fixtureId, resultData, updaterId) {
        return utils_1.tracer.startActiveSpan('service.MatchService.recordResult', async (span) => {
            try {
                // Extract strictly needed fields from resultData
                const { homeScore, awayScore, status } = resultData;
                const [affected, updatedFixtures] = await this.fixtureRepository.update(fixtureId, {
                    homeScore,
                    awayScore,
                    status: status || 'COMPLETED',
                    endTime: status === 'COMPLETED' ? new Date() : null
                });
                if (!affected)
                    throw new Error('Fixture not found');
                utils_1.structuredLogger.business('MATCH_UPDATE', 0, updaterId, {
                    fixtureId,
                    score: `${homeScore}-${awayScore}`,
                    status
                });
                return updatedFixtures[0];
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Renamed: getLeagueTable -> calculateLeagueTable
    // Updated signature to accept season string
    async calculateLeagueTable(season) {
        return utils_1.tracer.startActiveSpan('service.MatchService.calculateLeagueTable', async (span) => {
            try {
                // Filter by season if your DB supports it, otherwise fetch all completed
                const matches = await this.fixtureRepository.findAll({
                    where: { status: 'COMPLETED' }
                    // add season filter here if column exists
                });
                // Calculation logic (Simplified)
                const table = {};
                // ... logic to populate table from matches ...
                return Object.values(table).sort((a, b) => b.points - a.points);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    // Added: findAll (Missing in previous snippet)
    async findAll(filters) {
        return utils_1.tracer.startActiveSpan('service.MatchService.findAll', async (span) => {
            try {
                return await this.fixtureRepository.findAll(filters);
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.MatchService = MatchService;
//# sourceMappingURL=MatchService.js.map