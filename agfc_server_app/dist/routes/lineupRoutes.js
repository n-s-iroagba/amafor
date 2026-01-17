"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LineupController_1 = require("../controllers/LineupController");
const router = (0, express_1.Router)();
const lineupController = new LineupController_1.LineupController();
router.post('/', lineupController.createLineupPlayer);
router.get('/:fixtureId', lineupController.getLineupByFixture);
router.get('/:fixtureId/starters', lineupController.getStartersByFixture);
router.get('/:fixtureId/substitutes', lineupController.getSubstitutesByFixture);
router.post('/:fixtureId/batch', lineupController.batchUpdateLineup);
router.get('/:id/player', lineupController.getLineupPlayer);
router.put('/:id', lineupController.updateLineupPlayer);
router.delete('/:id', lineupController.deleteLineupPlayer);
exports.default = router;
//# sourceMappingURL=lineupRoutes.js.map