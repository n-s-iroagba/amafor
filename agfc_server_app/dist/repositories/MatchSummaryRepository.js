"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSummaryRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const MatchSummary_1 = __importDefault(require("../models/MatchSummary"));
const Fixture_1 = __importDefault(require("../models/Fixture"));
class MatchSummaryRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(MatchSummary_1.default);
    }
    async findByFixture(fixtureId) {
        return this.findOne({ where: { fixtureId }, include: [
                {
                    model: Fixture_1.default,
                    as: 'fixture'
                }
            ] });
    }
}
exports.MatchSummaryRepository = MatchSummaryRepository;
//# sourceMappingURL=MatchSummaryRepository.js.map