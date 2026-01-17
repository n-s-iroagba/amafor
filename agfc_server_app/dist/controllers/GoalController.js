"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalController = void 0;
const GoalService_1 = require("../services/GoalService");
class GoalController {
    constructor() {
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
                const goal = await this.goalService.getGoalById(parseInt(req.params.id));
                res.status(200).json(goal);
            }
            catch (error) {
                next(error);
            }
        };
        this.getGoalsByFixture = async (req, res, next) => {
            try {
                const goals = await this.goalService.getGoalsByFixture(parseInt(req.params.fixtureId));
                res.status(200).json(goals);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateGoal = async (req, res, next) => {
            try {
                const goal = await this.goalService.updateGoal(parseInt(req.params.id), req.body);
                res.status(200).json(goal);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteGoal = async (req, res, next) => {
            try {
                await this.goalService.deleteGoal(parseInt(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.getGoalsByScorer = async (req, res, next) => {
            try {
                const goals = await this.goalService.getGoalsByScorer(req.params.scorer);
                res.status(200).json(goals);
            }
            catch (error) {
                next(error);
            }
        };
        this.getPenaltyGoals = async (req, res, next) => {
            try {
                const goals = await this.goalService.getPenaltyGoals();
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