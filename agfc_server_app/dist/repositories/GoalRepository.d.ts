import Goal, { GoalCreationAttributes, GoalAttributes } from "@models/Goal";
import { BaseRepository } from "./BaseRepository";
export interface IGoalRepository {
    findById(id: string): Promise<Goal | null>;
    findAll(options?: any): Promise<Goal[]>;
    findOne(options?: any): Promise<Goal | null>;
    create(data: GoalCreationAttributes): Promise<Goal>;
    update(id: string, data: Partial<GoalAttributes>): Promise<[number, Goal[]]>;
    delete(id: string): Promise<number>;
    count(options?: any): Promise<number>;
    paginate(page: number, limit: number, options?: any): Promise<any>;
    exists(id: string): Promise<boolean>;
    findByFixtureId(fixtureId: string): Promise<Goal[]>;
    findByScorer(scorer: string): Promise<Goal[]>;
    findPenaltyGoals(): Promise<Goal[]>;
    findGoalsInTimeRange(minMinute?: number, maxMinute?: number): Promise<Goal[]>;
    getFixtureGoalCount(fixtureId: string): Promise<number>;
    getScorerStats(scorer: string): Promise<{
        totalGoals: number;
        penaltyGoals: number;
        averageMinute: number;
        fixturesScoredIn: number;
    }>;
    getTopScorers(limit?: number): Promise<Array<{
        scorer: string;
        totalGoals: number;
    }>>;
    getMatchTimeline(fixtureId: string): Promise<Goal[]>;
    getMatchResultByGoals(fixtureId: string): Promise<{
        homeGoals: number;
        awayGoals: number;
    } | null>;
    hasScoredInFixture(fixtureId: string, scorer: string): Promise<boolean>;
    bulkCreateForFixture(fixtureId: string, goals: GoalCreationAttributes[]): Promise<Goal[]>;
    deleteByFixtureId(fixtureId: string): Promise<number>;
    searchGoalsByScorer(query: string): Promise<Goal[]>;
    getGoalsByMinuteRange(fixtureId?: number): Promise<Record<string, number>>;
}
export declare class GoalRepository extends BaseRepository<Goal> implements IGoalRepository {
    constructor();
    findByFixtureId(fixtureId: string): Promise<Goal[]>;
    findByScorer(scorer: string): Promise<Goal[]>;
    findPenaltyGoals(): Promise<Goal[]>;
    findGoalsInTimeRange(minMinute?: number, maxMinute?: number): Promise<Goal[]>;
    getFixtureGoalCount(fixtureId: string): Promise<number>;
    getScorerStats(scorer: string): Promise<{
        totalGoals: number;
        penaltyGoals: number;
        averageMinute: number;
        fixturesScoredIn: number;
    }>;
    getTopScorers(limit?: number): Promise<Array<{
        scorer: string;
        totalGoals: number;
    }>>;
    getMatchTimeline(fixtureId: string): Promise<Goal[]>;
    getMatchResultByGoals(fixtureId: string): Promise<{
        homeGoals: number;
        awayGoals: number;
    } | null>;
    hasScoredInFixture(fixtureId: string, scorer: string): Promise<boolean>;
    bulkCreateForFixture(fixtureId: string, goals: GoalCreationAttributes[]): Promise<Goal[]>;
    deleteByFixtureId(fixtureId: string): Promise<number>;
    searchGoalsByScorer(query: string): Promise<Goal[]>;
    getGoalsByMinuteRange(fixtureId?: number): Promise<Record<string, number>>;
    create(data: GoalCreationAttributes): Promise<Goal>;
    update(id: string, data: Partial<GoalAttributes>): Promise<[number, Goal[]]>;
    getLateGoals(fixtureId?: number): Promise<Goal[]>;
    getEarlyGoals(fixtureId?: number): Promise<Goal[]>;
    getCompetitionStats(competition?: string): Promise<{
        totalGoals: number;
        averageGoalsPerMatch: number;
        totalPenalties: number;
        mostGoalsInAMatch: number;
    }>;
}
//# sourceMappingURL=GoalRepository.d.ts.map