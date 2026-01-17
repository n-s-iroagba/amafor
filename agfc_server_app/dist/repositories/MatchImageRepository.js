"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchImageRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const MatchImage_1 = __importDefault(require("../models/MatchImage"));
const Fixture_1 = __importDefault(require("../models/Fixture"));
class MatchImageRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(MatchImage_1.default);
    }
    async findByFixture(fixtureId) {
        return (await this.findAll({ where: { fixtureId }, include: [
                {
                    model: Fixture_1.default,
                    as: 'fixture'
                }
            ] }));
    }
}
exports.MatchImageRepository = MatchImageRepository;
//# sourceMappingURL=MatchImageRepository.js.map