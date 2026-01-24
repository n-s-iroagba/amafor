"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalController = void 0;
const GoalService_1 = require("../services/GoalService");
class GoalController {
    constructor() {
        /**
         * Record goal
         * @api POST /goals
         * @apiName API-GOAL-001
         * @apiGroup Goals
         * @srsRequirement REQ-PUB-02, REQ-ADM-03
         */
        this.createGoal = async (req, res, next) => {
            try {
                const goal = await this.goalService.createGoal(req.body);
                res.status(201).json(goal);
            }
            catch (error) {
                next(error);
            }
        };
        this.getGoal = async (req, res, next) => {
            try {
                const goal = await this.goalService.getGoalById(req.params.id);
                res.status(200).json(goal);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get goals for fixture
         * @api GET /goals/fixture/:fixtureId
         * @apiName API-GOAL-002
         * @apiGroup Goals
         * @srsRequirement REQ-PUB-02
         */
        this.getGoalsByFixture = async (req, res, next) => {
            try {
                const goals = await this.goalService.getFixtureGoals(req.params.fixtureId);
                res.status(200).json(goals);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update goal
         * @api PUT /goals/:id
         * @apiName API-GOAL-003
         * @apiGroup Goals
         * @srsRequirement REQ-ADM-03
         */
        this.updateGoal = async (req, res, next) => {
            try {
                const goal = await this.goalService.updateGoal(req.params.id, req.body);
                res.status(200).json(goal);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete goal
         * @api DELETE /goals/:id
         * @apiName API-GOAL-004
         * @apiGroup Goals
         * @srsRequirement REQ-ADM-03
         */
        this.deleteGoal = async (req, res, next) => {
            try {
                await this.goalService.deleteGoal(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.getGoalsByScorer = async (req, res, next) => {
            try {
                const goals = await this.goalService.searchGoalsByPlayer(req.params.scorer);
                res.status(200).json(goals);
            }
            catch (error) {
                next(error);
            }
        };
        this.getPenaltyGoals = async (req, res, next) => {
            try {
                const goals = await this.goalService.getPenaltyStats();
                res.status(200).json(goals);
            }
            catch (error) {
                next(error);
            }
        };
        this.goalService = new GoalService_1.GoalService();
    }
}
exports.GoalController = GoalController;
//# sourceMappingURL=GoalController.js.map