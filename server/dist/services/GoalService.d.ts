import { IGoalRepository } from '@repositories/GoalRepository';
import { GoalAttributes, GoalCreationAttributes } from '@models/Goal';
export interface CreateGoalData extends Omit<GoalCreationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export interface UpdateGoalData extends Partial<Omit<GoalAttributes, 'id' | 'createdAt' | 'updatedAt'>> {
}
export interface GoalAnalytics {
    id: string;
    scorer: string;
    minute: number;
    isPenalty: boolean;
    fixtureDetails: {
        id: string;
        homeTeam: string;
        awayTeam: string;
        matchDate: Date;
    };
}
export interface ScorerLeaderboard {
    scorer: string;
    totalGoals: number;
    penaltyGoals: number;
    averageMinute: number;
    lastGoalDate: Date | null;
}
export declare class GoalService {
    private repository;
    constructor(repository?: IGoalRepository);
    createGoal(data: GoalCreationAttributes): Promise<GoalAttributes>;
    getGoalById(id: string): Promise<GoalAttributes>;
    getFixtureGoals(fixtureId: string): Promise<GoalAttributes[]>;
    updateGoal(id: string, data: UpdateGoalData): Promise<GoalAttributes>;
    deleteGoal(id: string): Promise<void>;
    getFixtureTimeline(fixtureId: string): Promise<GoalAnalytics[]>;
    getScorerLeaderboard(limit?: number): Promise<ScorerLeaderboard[]>;
    getGoalDistribution(fixtureId?: number): Promise<Record<string, number>>;
    getLateGoals(fixtureId?: number): Promise<GoalAttributes[]>;
    getEarlyGoals(fixtureId?: number): Promise<GoalAttributes[]>;
    getPenaltyStats(): Promise<{
        totalPenalties: number;
        penaltyConversionRate: number;
        topPenaltyScorers: Array<{
            scorer: string;
            penalties: number;
        }>;
    }>;
    searchGoalsByPlayer(query: string): Promise<GoalAttributes[]>;
    getHatTrickAchievements(): Promise<Array<{
        scorer: string;
        fixtureId: string;
        goals: number;
    }>>;
    getFastestGoal(competition?: string): Promise<GoalAttributes | null>;
    bulkCreateFixtureGoals(fixtureId: string, goalsData: CreateGoalData[]): Promise<GoalAttributes[]>;
}
//# sourceMappingURL=GoalService.d.ts.map