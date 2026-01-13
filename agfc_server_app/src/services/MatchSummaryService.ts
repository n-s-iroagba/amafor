import { MatchSummaryRepository } from '../repositories/MatchSummaryRepository';
import { FixtureRepository } from '../repositories/FixtureRepository';
import { NotFoundError, DatabaseError, ValidationError } from '../utils/errors';
import MatchSummary  from '../models/MatchSummary';
import Fixture from '../models/Fixture';

export class MatchSummaryService {
  private matchSummaryRepository: MatchSummaryRepository;
  private fixtureRepository: FixtureRepository;

  constructor() {
    this.matchSummaryRepository = new MatchSummaryRepository();
    this.fixtureRepository = new FixtureRepository();
  }

  async createMatchSummary(summaryData: Partial<MatchSummary>): Promise<MatchSummary> {
    // Validate that the fixture exists
    const fixture = await this.fixtureRepository.findById(summaryData.fixtureId as number);
    if (!fixture) {
      throw new ValidationError(`Fixture with ID ${summaryData.fixtureId} does not exist`);
    }

    // Check if a summary already exists for this fixture
    const existingSummary = await this.matchSummaryRepository.findByFixture(summaryData.fixtureId as number);
    if (existingSummary) {
      throw new ValidationError(`A summary already exists for fixture ${summaryData.fixtureId}`);
    }

    try {
      return await this.matchSummaryRepository.create(summaryData as any);
    } catch (error) {
      throw error;
    }
  }

  async getMatchSummaryById(id: number): Promise<MatchSummary> {
    const summary = await this.matchSummaryRepository.findById(id,{include:[
      {
        model:Fixture,
        as:'fixture'
      }
    ]});
    if (!summary) {
      throw new NotFoundError(`Match summary with ID ${id} not found`);
    }
    return summary;
  }

  async getMatchSummaryByFixture(fixtureId: number): Promise<MatchSummary> {
    const summary = await this.matchSummaryRepository.findByFixture(fixtureId);
    if (!summary) {
      throw new NotFoundError(`Match summary for fixture ${fixtureId} not found`);
    }
    return summary;
  }

  async updateMatchSummary(id: number, summaryData: Partial<MatchSummary>): Promise<MatchSummary> {
    const summary = await this.getMatchSummaryById(id);
    
    try {
      const updatedSummary = await this.matchSummaryRepository.updateById(id, summaryData);
      if (!updatedSummary) {
        throw new DatabaseError(`Failed to update match summary with ID ${id}`);
      }
      return updatedSummary;
    } catch (error) {
      throw error;
    }
  }

  async deleteMatchSummary(id: number): Promise<void> {
    await this.getMatchSummaryById(id); // Check if summary exists
    
    try {
      const deleted = await this.matchSummaryRepository.deleteById(id);
      if (!deleted) {
        throw new DatabaseError(`Failed to delete match summary with ID ${id}`);
      }
    } catch (error) {
      throw error;
    }
  }
}