"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MatchImageController_1 = require("../controllers/MatchImageController");
const validation_1 = require("../middleware/validation");
const matchImage_schema_1 = require("../validations/matchImage.schema");
const router = (0, express_1.Router)();
const matchImageController = new MatchImageController_1.MatchImageController();
router.post('/:fixtureId', matchImageController.createMatchImage);
router.get('/fixture/:fixtureId', (0, validation_1.validate)(matchImage_schema_1.getMatchImagesByFixtureSchema), matchImageController.getMatchImagesByFixture);
router.get('/:id', (0, validation_1.validate)(matchImage_schema_1.getMatchImageSchema), matchImageController.getMatchImage);
router.put('/:id', (0, validation_1.validate)(matchImage_schema_1.updateMatchImageSchema), matchImageController.updateMatchImage);
router.delete('/:id', (0, validation_1.validate)(matchImage_schema_1.deleteMatchImageSchema), matchImageController.deleteMatchImage);
exports.default = router;
//# sourceMappingURL=matchImageRoutes.js.map