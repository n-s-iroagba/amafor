import { FixtureRepository } from '../repositories';
import { Fixture, FixtureCreationAttributes } from '../models';
import { structuredLogger, tracer } from '../utils';

export class MatchService {
  private fixtureRepository: FixtureRepository;

  constructor() {
    this.fixtureRepository = new FixtureRepository();
  }

  // Updated: Accepts creatorId to match Controller signature (even if not used extensively yet)
  public async createFixture(data: FixtureCreationAttributes, creatorId?: string): Promise<Fixture> {
    return tracer.startActiveSpan('service.MatchService.createFixture', async (span) => {
      try {
        const fixture = await this.fixtureRepository.create(data);
        structuredLogger.info('Fixture scheduled', { fixtureId: fixture.id, home: data.homeTeam, away: data.awayTeam, creatorId });
        return fixture;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        structuredLogger.error('Failed to create fixture', { error: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Renamed: getUpcomingFixtures -> getUpcoming
  public async getUpcoming(limit: number = 5): Promise<Fixture[]> {
    return tracer.startActiveSpan('service.MatchService.getUpcoming', async (span) => {
      try {
        return await this.fixtureRepository.findAll({ 
          limit, 
          order: [['matchDate', 'ASC']],
          where: { status: 'SCHEDULED' } 
        });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Renamed: updateMatchResult -> recordResult
  // Updated signature to accept (id, data, updaterId)
  public async recordResult(fixtureId: string, resultData: any, updaterId: string): Promise<Fixture> {
    return tracer.startActiveSpan('service.MatchService.recordResult', async (span) => {
      try {
        // Extract strictly needed fields from resultData
        const { homeScore, awayScore, status } = resultData;

        const [affected, updatedFixtures] = await this.fixtureRepository.update(fixtureId, {
          homeScore,
          awayScore,
          status: status || 'COMPLETED',
          endTime: status === 'COMPLETED' ? new Date() : null
        });

        if (!affected) throw new Error('Fixture not found');

        structuredLogger.business('MATCH_UPDATE', 0, updaterId, { 
          fixtureId, 
          score: `${homeScore}-${awayScore}`, 
          status 
        });

        return updatedFixtures[0];
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Renamed: getLeagueTable -> calculateLeagueTable
  // Updated signature to accept season string
  public async calculateLeagueTable(season: string): Promise<any[]> {
    return tracer.startActiveSpan('service.MatchService.calculateLeagueTable', async (span) => {
      try {
        // Filter by season if your DB supports it, otherwise fetch all completed
        const matches = await this.fixtureRepository.findAll({ 
          where: { status: 'COMPLETED' } 
          // add season filter here if column exists
        });
        
        // Calculation logic (Simplified)
        const table: Record<string, any> = {};
        
        // ... logic to populate table from matches ...

        return Object.values(table).sort((a: any, b: any) => b.points - a.points);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Added: findAll (Missing in previous snippet)
  public async findAll(filters: any): Promise<Fixture[]> {
    return tracer.startActiveSpan('service.MatchService.findAll', async (span) => {
      try {
        return await this.fixtureRepository.findAll(filters);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}