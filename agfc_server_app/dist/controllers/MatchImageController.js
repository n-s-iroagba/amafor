"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchImageController = void 0;
const MatchImageService_1 = require("../services/MatchImageService");
class MatchImageController {
    constructor() {
        this.createMatchImage = async (req, res, next) => {
            try {
                const image = await this.matchImageService.createMatchImage(req.body.images);
                res.status(201).json(image);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMatchImage = async (req, res, next) => {
            try {
                const image = await this.matchImageService.getMatchImageById(parseInt(req.params.id));
                res.status(200).json(image);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMatchImagesByFixture = async (req, res, next) => {
            try {
                const images = await this.matchImageService.getMatchImagesByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(images);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateMatchImage = async (req, res, next) => {
            try {
                const image = await this.matchImageService.updateMatchImage(parseInt(req.params.id), req.body);
                res.status(200).json(image);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteMatchImage = async (req, res, next) => {
            try {
                await this.matchImageService.deleteMatchImage(parseInt(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.matchImageService = new MatchImageService_1.MatchImageService();
    }
}
exports.MatchImageController = MatchImageController;
//# sourceMappingURL=MatchImageController.js.map