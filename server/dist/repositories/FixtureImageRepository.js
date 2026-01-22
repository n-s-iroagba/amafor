"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureImageRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const FixtureImage_1 = __importDefault(require("../models/FixtureImage"));
const Fixture_1 = __importDefault(require("../models/Fixture"));
class FixtureImageRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(FixtureImage_1.default);
    }
    async findByFixture(fixtureId) {
        return (await this.findAll({
            where: { fixtureId }, include: [
                {
                    model: Fixture_1.default,
                    as: 'fixture'
                }
            ]
        }));
    }
}
exports.FixtureImageRepository = FixtureImageRepository;
//# sourceMappingURL=FixtureImageRepository.js.map