import { BaseRepository } from './BaseRepository';
import MatchImage from '../models/MatchImage';
import Fixture from '../models/Fixture';

export class MatchImageRepository extends BaseRepository<MatchImage> {
  constructor() {
    super(MatchImage);
  }

  async findByFixture(fixtureId: number): Promise<MatchImage[]> {
    return (await this.findAll({ where: { fixtureId },include:[
      {
        model:Fixture,
        as:'fixture'
      }
    ] })).data;
  }
}