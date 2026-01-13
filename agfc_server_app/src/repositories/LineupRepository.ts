import { BaseRepository } from './BaseRepository';
import Lineup from '../models/Lineup';
import Player from '../models/Player';

export class LineupRepository extends BaseRepository<Lineup> {
  constructor() {
    super(Lineup);
  }

  async findByFixture(fixtureId: number): Promise<Lineup[]> {
    return (await this.findAll({ where: { fixtureId },
    include:[
      {
        model:Player,
        as:'player'
      }
    ] })).data;
  }

  async findStarters(fixtureId: number): Promise<Lineup[]> {
    return (await this.findAll({ where: { fixtureId, isStarter: true } })).data;
  }

  async findSubstitutes(fixtureId: number): Promise<Lineup[]> {
    return (await this.findAll({ where: { fixtureId, isStarter: false } })).data;
  }

  async findByPosition(fixtureId: number, position: string): Promise<Lineup[]> {
    return (await this.findAll({ where: { fixtureId, position } })).data;
  }
}