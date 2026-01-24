import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
export interface GoalAttributes {
    id: number;
    fixtureId: string;
    scorer: string;
    minute: number;
    isPenalty: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type GoalCreationAttributes = Omit<GoalAttributes, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
};
export declare class Goal extends Model<InferAttributes<Goal>, InferCreationAttributes<Goal>> {
    id: CreationOptional<number>;
    fixtureId: string;
    scorer: string;
    minute: number;
    isPenalty: boolean;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    isEarlyGoal(): boolean;
    isLateGoal(): boolean;
    isStoppageTimeGoal(): boolean;
    static getFixtureGoals(fixtureId: number): Promise<Goal[]>;
    static getTopScorer(limit?: number): Promise<Array<{
        scorer: string;
        count: number;
    }>>;
}
export default Goal;
//# sourceMappingURL=Goal.d.ts.map