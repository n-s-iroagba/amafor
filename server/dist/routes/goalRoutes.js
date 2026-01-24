"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GoalController_1 = require("../controllers/GoalController");
const validate_1 = require("../middleware/validate");
const goal_schema_1 = require("../validation-schema/goal.schema");
const router = (0, express_1.Router)();
const goalController = new GoalController_1.GoalController();
router.post('/:fixtureId', goalController.createGoal);
router.get('/fixture/:fixtureId', (0, validate_1.validate)(goal_schema_1.getGoalsByFixtureSchema), goalController.getGoalsByFixture);
router.get('/scorer/:scorer', (0, validate_1.validate)(goal_schema_1.getGoalsByScorerSchema), goalController.getGoalsByScorer);
router.get('/penalties', goalController.getPenaltyGoals);
router.get('/:id', (0, validate_1.validate)(goal_schema_1.getGoalSchema), goalController.getGoal);
router.put('/:id', (0, validate_1.validate)(goal_schema_1.updateGoalSchema), goalController.updateGoal);
router.delete('/:id', (0, validate_1.validate)(goal_schema_1.deleteGoalSchema), goalController.deleteGoal);
exports.default = router;
//# sourceMappingURL=goalRoutes.js.map