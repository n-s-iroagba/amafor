import { BaseRepository } from './BaseRepository';
import FixtureImage from '../models/FixtureImage';
import Fixture from '../models/Fixture';

export class FixtureImageRepository extends BaseRepository<FixtureImage> {
  constructor() {
    super(FixtureImage);
  }

  async findByFixture(fixtureId: number): Promise<FixtureImage[]> {
    return (await this.findAll({
      where: { fixtureId }, include: [
        {
          model: Fixture,
          as: 'fixture'
        }
      ]
    }));
  }
}