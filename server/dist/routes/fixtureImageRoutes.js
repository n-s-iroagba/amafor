"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FixtureImageController_1 = require("../controllers/FixtureImageController");
const validation_1 = require("../middleware/validation");
const fixtureImage_schema_1 = require("../validations/fixtureImage.schema");
const router = (0, express_1.Router)();
const fixtureImageController = new FixtureImageController_1.FixtureImageController();
router.post('/:fixtureId', fixtureImageController.createFixtureImage);
router.get('/fixture/:fixtureId', (0, validation_1.validate)(fixtureImage_schema_1.getFixtureImagesByFixtureSchema), fixtureImageController.getFixtureImagesByFixture);
router.get('/:id', (0, validation_1.validate)(fixtureImage_schema_1.getFixtureImageSchema), fixtureImageController.getFixtureImage);
router.put('/:id', (0, validation_1.validate)(fixtureImage_schema_1.updateFixtureImageSchema), fixtureImageController.updateFixtureImage);
router.delete('/:id', (0, validation_1.validate)(fixtureImage_schema_1.deleteFixtureImageSchema), fixtureImageController.deleteFixtureImage);
exports.default = router;
//# sourceMappingURL=fixtureImageRoutes.js.map