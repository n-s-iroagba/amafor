import { BaseRepository } from './BaseRepository';
import MatchSummary from '../models/MatchSummary';
import Fixture from '../models/Fixture';

export class MatchSummaryRepository extends BaseRepository<MatchSummary> {
  constructor() {
    super(MatchSummary);
  }

  async findByFixture(fixtureId: number): Promise<MatchSummary | null> {
    return this.findOne({ fixtureId },{include:[
      {
        model:Fixture,
        as:'fixture'
      }
    ]});
  }
}