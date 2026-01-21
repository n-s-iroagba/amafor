import { Router } from 'express';
import { GoalController } from '../controllers/GoalController';
import { validate } from '../middleware/validation';
import {
  createGoalSchema,
  updateGoalSchema,
  getGoalSchema,
  deleteGoalSchema,
  getGoalsByFixtureSchema,
  getGoalsByScorerSchema,
} from '../validations/goal.schema';

const router = Router();
const goalController = new GoalController();

router.post('/:fixtureId', goalController.createGoal);
router.get('/fixture/:fixtureId', validate(getGoalsByFixtureSchema), goalController.getGoalsByFixture);
router.get('/scorer/:scorer', validate(getGoalsByScorerSchema), goalController.getGoalsByScorer);
router.get('/penalties', goalController.getPenaltyGoals);
router.get('/:id', validate(getGoalSchema), goalController.getGoal);
router.put('/:id', validate(updateGoalSchema), goalController.updateGoal);
router.delete('/:id', validate(deleteGoalSchema), goalController.deleteGoal);

export default router;