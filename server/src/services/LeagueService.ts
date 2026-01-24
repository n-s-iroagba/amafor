
import League from '../models/League';
import { FixtureRepository, LeagueRepository } from '../repositories';
import { AppError } from '../utils/errors';
import { structuredLogger, tracer } from '../utils';
import Player from '../models/Player';
import PlayerLeagueStatistics from '../models/PlayerLeagueStatistics';

export class LeagueService {
    private leagueRepository: LeagueRepository;
    private fixtureRepository: FixtureRepository;

    constructor() {
        this.leagueRepository = new LeagueRepository();
        this.fixtureRepository = new FixtureRepository();
    }

    public async getAllLeagues(): Promise<League[]> {
        return tracer.startActiveSpan('service.LeagueService.getAllLeagues', async (span) => {
            try {
                return await this.leagueRepository.findAll();
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async getLeagueById(id: string): Promise<League | null> {
        return tracer.startActiveSpan('service.LeagueService.getLeagueById', async (span) => {
            try {
                return await this.leagueRepository.findById(id);
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async createLeague(data: any): Promise<League> {
        return tracer.startActiveSpan('service.LeagueService.createLeague', async (span) => {
            try {
                return await this.leagueRepository.create(data);
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async updateLeague(id: string, data: any): Promise<League | null> {
        return tracer.startActiveSpan('service.LeagueService.updateLeague', async (span) => {
            try {
                const [updated] = await this.leagueRepository.update(id, data);
                if (updated > 0) {
                    return await this.leagueRepository.findById(id);
                }
                return null;
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async deleteLeague(id: string): Promise<boolean> {
        return tracer.startActiveSpan('service.LeagueService.deleteLeague', async (span) => {
            try {
                const deleted = await this.leagueRepository.delete(id);
                return deleted > 0;
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }


    public async getLeagueWithTable(leagueId: string): Promise<any> {
        return tracer.startActiveSpan('service.LeagueService.getLeagueWithTable', async (span) => {
            try {
                const league = await this.leagueRepository.findById(leagueId);
                if (!league) throw new AppError('League not found', 404);

                const matches = await this.fixtureRepository.findAll({
                    where: { leagueId, status: 'COMPLETED' },
                    order: [['matchDate', 'ASC']]
                });

                const table = this.calculateTable(matches);

                // Fetch player-specific statistics
                const topScorer = await PlayerLeagueStatistics.findOne({
                    where: { leagueId },
                    order: [['goals', 'DESC']],
                    include: [{ model: Player, as: 'player', attributes: ['name'] }]
                });

                const mostAssists = await PlayerLeagueStatistics.findOne({
                    where: { leagueId },
                    order: [['assists', 'DESC']],
                    include: [{ model: Player, as: 'player', attributes: ['name'] }]
                });

                const bestDefense = [...table].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];
                const bestAttack = [...table].sort((a, b) => b.goalsFor - a.goalsFor)[0];

                // Recent fixtures (last 5)
                const recentFixtures = await this.fixtureRepository.findAll({
                    where: { leagueId, status: 'COMPLETED' },
                    order: [['matchDate', 'DESC']],
                    limit: 5
                });

                return {
                    ...league.toJSON(),
                    table,
                    statistics: {
                        topScorer: topScorer ? {
                            name: (topScorer as any).player?.name || 'Unknown',
                            goals: topScorer.goals,
                            team: 'Amafor Gladiators' // Players in the database are usually part of our scouting system
                        } : null,
                        mostAssists: mostAssists ? {
                            name: (mostAssists as any).player?.name || 'Unknown',
                            assists: mostAssists.assists,
                            team: 'Amafor Gladiators'
                        } : null,
                        bestDefense: bestDefense ? { team: bestDefense.team, goalsAgainst: bestDefense.goalsAgainst } : null,
                        bestAttack: bestAttack ? { team: bestAttack.team, goalsFor: bestAttack.goalsFor } : null
                    },
                    recentFixtures: recentFixtures.map(f => ({
                        id: f.id,
                        homeTeam: f.homeTeam,
                        awayTeam: f.awayTeam,
                        homeScore: f.homeScore,
                        awayScore: f.awayScore,
                        matchDate: f.matchDate
                    }))
                };
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async getLeaguesWithTables(): Promise<any[]> {
        return tracer.startActiveSpan('service.LeagueService.getLeaguesWithTables', async (span) => {
            try {
                const leagues = await this.leagueRepository.findAll();
                const results = [];

                for (const league of leagues) {
                    const matches = await this.fixtureRepository.findAll({
                        where: { leagueId: league.id, status: 'COMPLETED' }
                    });
                    const table = this.calculateTable(matches);

                    // Add Amafor stats explicitly if needed by frontend
                    const amaforStats = table.find((t: any) => t.team === 'Amafor Gladiators');
                    const amaforPosition = amaforStats ? amaforStats.position : null;

                    results.push({ ...league.toJSON(), table, amaforStats, amaforPosition });
                }
                return results;
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }


    private calculateTable(matches: any[]): any[] {
        const table: Record<string, any> = {};

        // Sort matches by date to ensure form is calculated chronologically
        const sortedMatches = [...matches].sort((a, b) =>
            new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
        );

        sortedMatches.forEach((match) => {
            // Initialize home team
            if (!table[match.homeTeam]) {
                table[match.homeTeam] = this.initTeamStats(match.homeTeam);
            }
            // Initialize away team
            if (!table[match.awayTeam]) {
                table[match.awayTeam] = this.initTeamStats(match.awayTeam);
            }

            const homeStats = table[match.homeTeam];
            const awayStats = table[match.awayTeam];

            const homeScore = match.homeScore || 0;
            const awayScore = match.awayScore || 0;

            homeStats.played += 1;
            awayStats.played += 1;
            homeStats.goalsFor += homeScore;
            homeStats.goalsAgainst += awayScore;
            awayStats.goalsFor += awayScore;
            awayStats.goalsAgainst += homeScore;

            if (homeScore > awayScore) {
                homeStats.won += 1;
                homeStats.points += 3;
                homeStats.form.push('W');
                awayStats.lost += 1;
                awayStats.form.push('L');
            } else if (homeScore < awayScore) {
                awayStats.won += 1;
                awayStats.points += 3;
                awayStats.form.push('W');
                homeStats.lost += 1;
                homeStats.form.push('L');
            } else {
                homeStats.draw += 1;
                homeStats.points += 1;
                homeStats.form.push('D');
                awayStats.draw += 1;
                awayStats.points += 1;
                awayStats.form.push('D');
            }

            homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
            awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;
        });

        const sortedTable = Object.values(table).sort((a: any, b: any) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        });

        // Assign positions and format form array
        return sortedTable.map((team, index) => ({
            ...team,
            position: index + 1,
            form: team.form.slice(-5)
        }));
    }

    private initTeamStats(teamName: string) {
        return {
            team: teamName,
            played: 0,
            won: 0,
            draw: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            form: [] as string[]
        };
    }

}
