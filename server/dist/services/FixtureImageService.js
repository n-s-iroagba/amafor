"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureImageService = void 0;
const FixtureImageRepository_1 = require("../repositories/FixtureImageRepository");
const FixtureRepository_1 = require("../repositories/FixtureRepository");
const errors_1 = require("../utils/errors");
const FixtureImage_1 = __importDefault(require("../models/FixtureImage"));
const Fixture_1 = __importDefault(require("../models/Fixture"));
class FixtureImageService {
    constructor() {
        this.fixtureImageRepository = new FixtureImageRepository_1.FixtureImageRepository();
        this.fixtureRepository = new FixtureRepository_1.FixtureRepository();
    }
    async createFixtureImage(imageData) {
        console.log('llllllllllllll');
        try {
            return await FixtureImage_1.default.bulkCreate(imageData);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getFixtureImageById(id) {
        const image = await this.fixtureImageRepository.findById(id, {
            include: [
                {
                    model: Fixture_1.default,
                    as: 'fixture'
                }
            ]
        });
        if (!image) {
            throw new errors_1.NotFoundError(`Fixture image with ID ${id} not found`);
        }
        return image;
    }
    async getFixtureImagesByFixture(fixtureId) {
        try {
            console.log(await this.fixtureImageRepository.findAll());
            return await this.fixtureImageRepository.findByFixture(fixtureId);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async updateFixtureImage(id, imageData) {
        const image = await this.getFixtureImageById(id);
        try {
            const [count, updatedImages] = await this.fixtureImageRepository.update(id, imageData);
            if (count === 0) {
                throw new errors_1.DatabaseError(`Failed to update match image with ID ${id}`);
            }
            return updatedImages[0] || image;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async deleteFixtureImage(id) {
        await this.getFixtureImageById(id); // Check if image exists
        try {
            const deleted = await this.fixtureImageRepository.delete(id);
            if (deleted === 0) {
                throw new errors_1.DatabaseError(`Failed to delete match image with ID ${id}`);
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.FixtureImageService = FixtureImageService;
//# sourceMappingURL=FixtureImageService.js.map