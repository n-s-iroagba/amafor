"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureSummaryRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const FixtureSummary_1 = __importDefault(require("../models/FixtureSummary"));
const Fixture_1 = __importDefault(require("../models/Fixture"));
class FixtureSummaryRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(FixtureSummary_1.default);
    }
    async findByFixture(fixtureId) {
        return this.findOne({
            where: { fixtureId }, include: [
                {
                    model: Fixture_1.default,
                    as: 'fixture'
                }
            ]
        });
    }
}
exports.FixtureSummaryRepository = FixtureSummaryRepository;
//# sourceMappingURL=FixtureSummaryRepository.js.map