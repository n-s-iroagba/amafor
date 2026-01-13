import { LineupRepository } from '../repositories/LineupRepository';
import { FixtureRepository } from '../repositories/FixtureRepository';
import { NotFoundError, DatabaseError, ValidationError } from '../utils/errors';
import  Lineup  from '../models/Lineup';

export class LineupService {
  private lineupRepository: LineupRepository;
  private fixtureRepository: FixtureRepository;

  constructor() {
    this.lineupRepository = new LineupRepository();
    this.fixtureRepository = new FixtureRepository();
  }

  async createLineupPlayer(lineupData: Partial<Lineup>): Promise<Lineup> {
    // Validate that the fixture exists
    const fixture = await this.fixtureRepository.findById(lineupData.fixtureId as number);
    if (!fixture) {
      throw new ValidationError(`Fixture with ID ${lineupData.fixtureId} does not exist`);
    }

    try {
      return await this.lineupRepository.create(lineupData as any);
    } catch (error) {
      throw error
    }
  }

  async getLineupPlayerById(id: number): Promise<Lineup> {
    const player = await this.lineupRepository.findById(id);
    if (!player) {
      throw new NotFoundError(`Lineup player with ID ${id} not found`);
    }
    return player;
  }

  async getLineupByFixture(fixtureId: number): Promise<Lineup[]> {
    try {
      return await this.lineupRepository.findByFixture(fixtureId);
    } catch (error) {
      throw error;
    }
  }

  async getStartersByFixture(fixtureId: number): Promise<Lineup[]> {
    try {
      return await this.lineupRepository.findStarters(fixtureId);
    } catch (error) {
      throw error;
    }
  }

  async getSubstitutesByFixture(fixtureId: number): Promise<Lineup[]> {
    try {
      return await this.lineupRepository.findSubstitutes(fixtureId);
    } catch (error) {
      throw error;
    }
  }

  async updateLineupPlayer(id: number, lineupData: Partial<Lineup>): Promise<Lineup> {
  
    
    try {
      const updatedPlayer = await this.lineupRepository.updateById(id, lineupData);
      if (!updatedPlayer) {
        throw new DatabaseError(`Failed to update lineup player with ID ${id}`);
      }
      return updatedPlayer;
    } catch (error) {
      throw error
    }
  }

  async deleteLineupPlayer(id: number): Promise<void> {
    await this.getLineupPlayerById(id); // Check if player exists
    
    try {
      const deleted = await this.lineupRepository.deleteById(id);
      if (!deleted) {
        throw new DatabaseError(`Failed to delete lineup player with ID ${id}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async batchUpdateLineup(fixtureId: number, lineupData: Partial<Lineup>[]): Promise<Lineup[]> {
    // First, delete all existing lineup entries for this fixture
    try {
      const existingLineup = await this.lineupRepository.findByFixture(fixtureId);
      for (const player of existingLineup) {
        await this.lineupRepository.deleteById(player.id);
      }
    } catch (error) {
      throw error;
    }

    // Then create new lineup entries
    try {
      const newLineup: Lineup[] = [];
      for (const playerData of lineupData) {
        const player = await this.lineupRepository.create({
          ...playerData,
          fixtureId
        } as Lineup);
        newLineup.push(player);
      }
      return newLineup;
    } catch (error) {
      throw error;
    }
  }
}