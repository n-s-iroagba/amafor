import Fixture, { FixtureCreationAttributes } from '@models/Fixture';
import { FixtureRepository } from '../repositories';

import { structuredLogger, tracer } from '../utils';

export class FixtureService {
  private fixtureRepository: FixtureRepository;

  constructor() {
    this.fixtureRepository = new FixtureRepository();
  }

  // Updated: Accepts creatorId to match Controller signature (even if not used extensively yet)
  public async createFixture(data: FixtureCreationAttributes, creatorId?: string): Promise<Fixture> {
    return tracer.startActiveSpan('service.FixtureService.createFixture', async (span) => {
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
    return tracer.startActiveSpan('service.FixtureService.getUpcoming', async (span) => {
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

  // Renamed: updateFixtureResult -> recordResult
  // Updated signature to accept (id, data, updaterId)
  public async recordResult(fixtureId: string, resultData: any, updaterId: string): Promise<Fixture> {
    return tracer.startActiveSpan('service.FixtureService.recordResult', async (span) => {
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
    return tracer.startActiveSpan('service.FixtureService.calculateLeagueTable', async (span) => {
      try {
        // Fetch all completed matches for the league
        // Note: Assuming 'season' filtering needs to be handled by date range or specific season field if added later
        // For now, we fetch all completed fixtures. In a real scenario, we'd filter by leagueId and season dates.
        const matches = await this.fixtureRepository.findAll({
          where: { status: 'COMPLETED' }
        });

        const table: Record<string, any> = {};

        matches.forEach((match) => {
          // Initialize home team if not exists
          if (!table[match.homeTeam]) {
            table[match.homeTeam] = {
              team: match.homeTeam,
              played: 0,
              won: 0,
              drawn: 0,
              lost: 0,
              gf: 0,
              ga: 0,
              gd: 0,
              points: 0
            };
          }

          // Initialize away team if not exists
          if (!table[match.awayTeam]) {
            table[match.awayTeam] = {
              team: match.awayTeam,
              played: 0,
              won: 0,
              drawn: 0,
              lost: 0,
              gf: 0,
              ga: 0,
              gd: 0,
              points: 0
            };
          }

          const homeStats = table[match.homeTeam];
          const awayStats = table[match.awayTeam];

          const homeScore = match.homeScore || 0;
          const awayScore = match.awayScore || 0;

          homeStats.played += 1;
          awayStats.played += 1;
          homeStats.gf += homeScore;
          homeStats.ga += awayScore;
          awayStats.gf += awayScore;
          awayStats.ga += homeScore;

          if (homeScore > awayScore) {
            homeStats.won += 1;
            homeStats.points += 3;
            awayStats.lost += 1;
          } else if (homeScore < awayScore) {
            awayStats.won += 1;
            awayStats.points += 3;
            homeStats.lost += 1;
          } else {
            homeStats.drawn += 1;
            homeStats.points += 1;
            awayStats.drawn += 1;
            awayStats.points += 1;
          }

          homeStats.gd = homeStats.gf - homeStats.ga;
          awayStats.gd = awayStats.gf - awayStats.ga;
        });

        // Sort by Points, then Goal Difference, then Goals For
        return Object.values(table).sort((a: any, b: any) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.gd !== a.gd) return b.gd - a.gd;
          return b.gf - a.gf;
        });
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
    return tracer.startActiveSpan('service.FixtureService.findAll', async (span) => {
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

  public async findById(id: string | number, options?: any): Promise<Fixture | null> {
    return tracer.startActiveSpan('service.FixtureService.findById', async (span) => {
      try {
        return await this.fixtureRepository.findById(String(id), options);
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async update(id: string | number, data: any): Promise<number> {
    return tracer.startActiveSpan('service.FixtureService.update', async (span) => {
      try {
        const [affected] = await this.fixtureRepository.update(String(id), data);
        return affected;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async delete(id: string | number): Promise<boolean> {
    return tracer.startActiveSpan('service.FixtureService.delete', async (span) => {
      try {
        const deleted = await this.fixtureRepository.delete(String(id));
        return deleted > 0;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async findByLeague(leagueId: string | number): Promise<Fixture[]> {
    return tracer.startActiveSpan('service.FixtureService.findByLeague', async (span) => {
      try {
        return await this.fixtureRepository.findAll({ where: { leagueId } });
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}