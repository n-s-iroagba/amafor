import { BaseRepository } from './BaseRepository';
import Goal from '../models/Goal';

export class GoalRepository extends BaseRepository<Goal> {
  constructor() {
    super(Goal);
  }

  async findByFixture(fixtureId: number): Promise<Goal[]> {
    return (await this.findAll({ where: { fixtureId } })).data;
  }

  async findByScorer(scorer: string): Promise<Goal[]> {
    return (await this.findAll({ where: { scorer } })).data;
  }

  async findPenalties(): Promise<Goal[]> {
    return (await this.findAll({ where: { isPenalty: true } })).data;
  }
}