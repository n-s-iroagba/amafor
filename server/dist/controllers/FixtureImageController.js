"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureImageController = void 0;
const FixtureImageService_1 = require("../services/FixtureImageService");
class FixtureImageController {
    constructor() {
        /**
         * Upload match image
         * @api POST /match-gallery
         * @apiName API-GALLERY-001
         * @apiGroup Fixture Gallery
         * @srsRequirement REQ-PUB-07, REQ-ADM-03
         */
        this.createFixtureImage = async (req, res, next) => {
            try {
                const image = await this.fixtureImageService.createFixtureImage(req.body.images);
                res.status(201).json(image);
            }
            catch (error) {
                next(error);
            }
        };
        this.getFixtureImage = async (req, res, next) => {
            try {
                const image = await this.fixtureImageService.getFixtureImageById(parseInt(req.params.id));
                res.status(200).json(image);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get images for fixture
         * @api GET /match-gallery/fixture/:fixtureId
         * @apiName API-GALLERY-002
         * @apiGroup Fixture Gallery
         * @srsRequirement REQ-PUB-07
         */
        this.getFixtureImagesByFixture = async (req, res, next) => {
            try {
                const images = await this.fixtureImageService.getFixtureImagesByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(images);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateFixtureImage = async (req, res, next) => {
            try {
                const image = await this.fixtureImageService.updateFixtureImage(parseInt(req.params.id), req.body);
                res.status(200).json(image);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete image
         * @api DELETE /match-gallery/:id
         * @apiName API-GALLERY-003
         * @apiGroup Fixture Gallery
         * @srsRequirement REQ-ADM-03
         */
        this.deleteFixtureImage = async (req, res, next) => {
            try {
                await this.fixtureImageService.deleteFixtureImage(parseInt(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.fixtureImageService = new FixtureImageService_1.FixtureImageService();
    }
}
exports.FixtureImageController = FixtureImageController;
//# sourceMappingURL=FixtureImageController.js.map