"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureSummaryService = void 0;
const FixtureSummaryRepository_1 = require("../repositories/FixtureSummaryRepository");
const errors_1 = require("../utils/errors");
class FixtureSummaryService {
    constructor() {
        this.repository = new FixtureSummaryRepository_1.FixtureSummaryRepository();
    }
    async createFixtureSummary(data) {
        try {
            return await this.repository.create(data);
        }
        catch (error) {
            throw error;
        }
    }
    async getFixtureSummaryById(id) {
        const summary = await this.repository.findById(id);
        if (!summary) {
            throw new errors_1.NotFoundError(`Fixture summary with ID ${id} not found`);
        }
        return summary;
    }
    async getFixtureSummaryByFixture(fixtureId) {
        return await this.repository.findByFixture(String(fixtureId));
    }
    async updateFixtureSummary(id, data) {
        const summary = await this.getFixtureSummaryById(id);
        const [count, updated] = await this.repository.update(id, data);
        if (count === 0) {
            throw new errors_1.DatabaseError(`Failed to update fixture summary with ID ${id}`);
        }
        return updated[0] || summary;
    }
    async deleteFixtureSummary(id) {
        const deleted = await this.repository.delete(id);
        if (deleted === 0) {
            throw new errors_1.NotFoundError(`Fixture summary with ID ${id} not found`);
        }
    }
}
exports.FixtureSummaryService = FixtureSummaryService;
//# sourceMappingURL=FixtureSummaryService.js.map