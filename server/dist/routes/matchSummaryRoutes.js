"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FixtureSummaryController_1 = require("../controllers/FixtureSummaryController");
const validation_1 = require("../middleware/validation");
const matchSummary_schema_1 = require("../validations/matchSummary.schema");
const router = (0, express_1.Router)();
const matchSummaryController = new FixtureSummaryController_1.FixtureSummaryController();
router.post('/:fixtureId', matchSummaryController.createFixtureSummary);
router.get('/fixture/:fixtureId', (0, validation_1.validate)(matchSummary_schema_1.getFixtureSummaryByFixtureSchema), matchSummaryController.getFixtureSummaryByFixture);
router.get('/:id', (0, validation_1.validate)(matchSummary_schema_1.getFixtureSummarySchema), matchSummaryController.getFixtureSummary);
router.put('/:id', (0, validation_1.validate)(matchSummary_schema_1.updateFixtureSummarySchema), matchSummaryController.updateFixtureSummary);
router.delete('/:id', (0, validation_1.validate)(matchSummary_schema_1.deleteFixtureSummarySchema), matchSummaryController.deleteFixtureSummary);
exports.default = router;
//# sourceMappingURL=matchSummaryRoutes.js.map