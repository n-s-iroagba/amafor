"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchImageService = void 0;
const MatchImageRepository_1 = require("../repositories/MatchImageRepository");
const FixtureRepository_1 = require("../repositories/FixtureRepository");
const errors_1 = require("../utils/errors");
const MatchImage_1 = __importDefault(require("../models/MatchImage"));
const Fixture_1 = __importDefault(require("../models/Fixture"));
class MatchImageService {
    constructor() {
        this.matchImageRepository = new MatchImageRepository_1.MatchImageRepository();
        this.fixtureRepository = new FixtureRepository_1.FixtureRepository();
    }
    async createMatchImage(imageData) {
        console.log('llllllllllllll');
        try {
            return await MatchImage_1.default.bulkCreate(imageData);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getMatchImageById(id) {
        const image = await this.matchImageRepository.findById(id, {
            include: [
                {
                    model: Fixture_1.default,
                    as: 'fixture'
                }
            ]
        });
        if (!image) {
            throw new errors_1.NotFoundError(`Match image with ID ${id} not found`);
        }
        return image;
    }
    async getMatchImagesByFixture(fixtureId) {
        try {
            console.log(await this.matchImageRepository.findAll());
            return await this.matchImageRepository.findByFixture(fixtureId);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async updateMatchImage(id, imageData) {
        const image = await this.getMatchImageById(id);
        try {
            const updatedImage = await this.matchImageRepository.updateById(id, imageData);
            if (!updatedImage) {
                throw new errors_1.DatabaseError(`Failed to update match image with ID ${id}`);
            }
            return updatedImage;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async deleteMatchImage(id) {
        await this.getMatchImageById(id); // Check if image exists
        try {
            const deleted = await this.matchImageRepository.deleteById(id);
            if (!deleted) {
                throw new errors_1.DatabaseError(`Failed to delete match image with ID ${id}`);
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.MatchImageService = MatchImageService;
//# sourceMappingURL=MatchImageService.js.map