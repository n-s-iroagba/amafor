"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSummaryService = void 0;
const MatchSummaryRepository_1 = require("../repositories/MatchSummaryRepository");
const FixtureRepository_1 = require("../repositories/FixtureRepository");
const errors_1 = require("../utils/errors");
const Fixture_1 = __importDefault(require("../models/Fixture"));
class MatchSummaryService {
    constructor() {
        this.matchSummaryRepository = new MatchSummaryRepository_1.MatchSummaryRepository();
        this.fixtureRepository = new FixtureRepository_1.FixtureRepository();
    }
    async createMatchSummary(summaryData) {
        // Validate that the fixture exists
        const fixture = await this.fixtureRepository.findById(summaryData.fixtureId);
        if (!fixture) {
            throw new errors_1.ValidationError(`Fixture with ID ${summaryData.fixtureId} does not exist`);
        }
        // Check if a summary already exists for this fixture
        const existingSummary = await this.matchSummaryRepository.findByFixture(summaryData.fixtureId);
        if (existingSummary) {
            throw new errors_1.ValidationError(`A summary already exists for fixture ${summaryData.fixtureId}`);
        }
        try {
            return await this.matchSummaryRepository.create(summaryData);
        }
        catch (error) {
            throw error;
        }
    }
    async getMatchSummaryById(id) {
        const summary = await this.matchSummaryRepository.findById(id, { include: [
                {
                    model: Fixture_1.default,
                    as: 'fixture'
                }
            ] });
        if (!summary) {
            throw new errors_1.NotFoundError(`Match summary with ID ${id} not found`);
        }
        return summary;
    }
    async getMatchSummaryByFixture(fixtureId) {
        const summary = await this.matchSummaryRepository.findByFixture(fixtureId);
        if (!summary) {
            throw new errors_1.NotFoundError(`Match summary for fixture ${fixtureId} not found`);
        }
        return summary;
    }
    async updateMatchSummary(id, summaryData) {
        const summary = await this.getMatchSummaryById(id);
        try {
            const updatedSummary = await this.matchSummaryRepository.updateById(id, summaryData);
            if (!updatedSummary) {
                throw new errors_1.DatabaseError(`Failed to update match summary with ID ${id}`);
            }
            return updatedSummary;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteMatchSummary(id) {
        await this.getMatchSummaryById(id); // Check if summary exists
        try {
            const deleted = await this.matchSummaryRepository.deleteById(id);
            if (!deleted) {
                throw new errors_1.DatabaseError(`Failed to delete match summary with ID ${id}`);
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.MatchSummaryService = MatchSummaryService;
//# sourceMappingURL=MatchSummaryService.js.map