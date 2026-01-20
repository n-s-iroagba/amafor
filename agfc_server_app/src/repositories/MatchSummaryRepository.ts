import { BaseRepository } from './BaseRepository';
import FixtureSummary from '../models/FixtureSummary';
import Fixture from '../models/Fixture';

export class FixtureSummaryRepository extends BaseRepository<FixtureSummary> {
  constructor() {
    super(FixtureSummary);
  }

  async findByFixture(fixtureId: string): Promise<FixtureSummary | null> {
    return this.findOne({
      where: { fixtureId }, include: [
        {
          model: Fixture,
          as: 'fixture'
        }
      ]
    });
  }
}