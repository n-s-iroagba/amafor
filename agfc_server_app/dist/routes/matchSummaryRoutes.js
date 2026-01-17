"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MatchSummaryController_1 = require("../controllers/MatchSummaryController");
const validation_1 = require("../middleware/validation");
const matchSummary_schema_1 = require("../validations/matchSummary.schema");
const router = (0, express_1.Router)();
const matchSummaryController = new MatchSummaryController_1.MatchSummaryController();
router.post('/:fixtureId', matchSummaryController.createMatchSummary);
router.get('/fixture/:fixtureId', (0, validation_1.validate)(matchSummary_schema_1.getMatchSummaryByFixtureSchema), matchSummaryController.getMatchSummaryByFixture);
router.get('/:id', (0, validation_1.validate)(matchSummary_schema_1.getMatchSummarySchema), matchSummaryController.getMatchSummary);
router.put('/:id', (0, validation_1.validate)(matchSummary_schema_1.updateMatchSummarySchema), matchSummaryController.updateMatchSummary);
router.delete('/:id', (0, validation_1.validate)(matchSummary_schema_1.deleteMatchSummarySchema), matchSummaryController.deleteMatchSummary);
exports.default = router;
//# sourceMappingURL=matchSummaryRoutes.js.map