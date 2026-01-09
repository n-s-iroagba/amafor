import { FindOptions, Op, Transaction } from 'sequelize';
import { Fixture, FixtureAttributes, FixtureCreationAttributes, FixtureStatus, ArchiveStatus } from '@models/Fixture';
import { BaseRepository } from './BaseRepository';
import { AuditLogRepository } from './AuditLogRepository';
import { logger } from '@utils/logger';
import { tracer } from '@utils/tracer';

export interface FixtureFilterOptions {
  status?: FixtureStatus;
  dateFrom?: Date;
  dateTo?: Date;
  competition?: string;
  search?: string;
}

export class FixtureRepository extends BaseRepository<Fixture> {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    super(Fixture);
    this.auditLogRepository = new AuditLogRepository();
  }

  async createWithAudit(data: FixtureCreationAttributes, auditData: any): Promise<Fixture> {
    return tracer.startActiveSpan('repository.Fixture.createWithAudit', async (span) => {
      const transaction = await Fixture.sequelize!.transaction();
      
      try {
        span.setAttribute('homeTeam', data.homeTeam);
        span.setAttribute('awayTeam', data.awayTeam);
        
        const fixture = await this.create(data, { transaction });
        
        // Create audit log
        await this.auditLogRepository.create({
          userId: auditData.userId,
          userEmail: auditData.userEmail,
          userType: auditData.userType,
          action: 'create',
          entityType: 'fixture',
          entityId: fixture.id,
          entityName: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
          newValue: fixture.toJSON(),
          changes: Object.keys(data).map(key => ({
            field: key,
            newValue: data[key as keyof FixtureCreationAttributes]
          })),
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`Fixture created with audit: ${fixture.id}`);
        return fixture;
      } catch (error) {
        await transaction.rollback();
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error creating fixture with audit', { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateWithAudit(id: string, data: Partial<FixtureAttributes>, auditData: any): Promise<Fixture | null> {
    return tracer.startActiveSpan('repository.Fixture.updateWithAudit', async (span) => {
      const transaction = await Fixture.sequelize!.transaction();
      
      try {
        span.setAttribute('id', id);
        
        const fixture = await this.findById(id, { transaction });
        if (!fixture) {
          throw new Error('Fixture not found');
        }

        const oldValue = fixture.toJSON();
        
        // Update fixture
        await fixture.update(
          {
            ...data,
            updatedById: auditData.userId
          },
          { transaction }
        );
        
        // Get changes
        const changes = Object.keys(data)
          .filter(key => fixture.get(key) !== oldValue[key])
          .map(key => ({
            field: key,
            oldValue: oldValue[key],
            newValue: data[key as keyof FixtureAttributes]
          }));

        // Create audit log
        await this.auditLogRepository.create({
          userId: auditData.userId,
          userEmail: auditData.userEmail,
          userType: auditData.userType,
          action: 'update',
          entityType: 'fixture',
          entityId: id,
          entityName: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
          oldValue,
          newValue: fixture.toJSON(),
          changes,
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        }, { transaction });

        await transaction.commit();
        logger.info(`Fixture updated with audit: ${id}`);
        return fixture;
      } catch (error) {
        await transaction.rollback();
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error updating fixture with audit: ${id}`, { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findWithFilters(filters: FixtureFilterOptions, pagination?: { page: number; limit: number }): Promise<{ data: Fixture[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.Fixture.findWithFilters', async (span) => {
      try {
        span.setAttribute('filters', JSON.stringify(filters));

        const where: any = {};
        
        // Apply filters
        if (filters.status) {
          where.status = filters.status;
        }
        
        if (filters.competition) {
          where.competition = filters.competition;
        }
        
        if (filters.dateFrom || filters.dateTo) {
          where.matchDate = {};
          if (filters.dateFrom) {
            where.matchDate[Op.gte] = filters.dateFrom;
          }
          if (filters.dateTo) {
            where.matchDate[Op.lte] = filters.dateTo;
          }
        }
        
        if (filters.search) {
          where[Op.or] = [
            { homeTeam: { [Op.like]: `%${filters.search}%` } },
            { awayTeam: { [Op.like]: `%${filters.search}%` } },
            { competition: { [Op.like]: `%${filters.search}%` } },
            { venue: { [Op.like]: `%${filters.search}%` } }
          ];
        }

        const options: FindOptions = {
          where,
          order: [['matchDate', 'DESC']]
        };

        if (pagination) {
          return await this.paginate(pagination.page, pagination.limit, options);
        } else {
          const data = await this.findAll(options);
          const total = await this.count({ where });
          return {
            data,
            total,
            page: 1,
            totalPages: 1
          };
        }
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error finding fixtures with filters', { error, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findUpcoming(limit: number = 10): Promise<Fixture[]> {
    return tracer.startActiveSpan('repository.Fixture.findUpcoming', async (span) => {
      try {
        span.setAttribute('limit', limit);
        
        const fixtures = await this.findAll({
          where: {
            status: FixtureStatus.SCHEDULED,
            matchDate: { [Op.gte]: new Date() }
          },
          order: [['matchDate', 'ASC']],
          limit
        });

        span.setAttribute('count', fixtures.length);
        return fixtures;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error finding upcoming fixtures', { error, limit });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findRecentResults(limit: number = 10): Promise<Fixture[]> {
    return tracer.startActiveSpan('repository.Fixture.findRecentResults', async (span) => {
      try {
        span.setAttribute('limit', limit);
        
        const fixtures = await this.findAll({
          where: {
            status: FixtureStatus.COMPLETED
          },
          order: [['matchDate', 'DESC']],
          limit
        });

        span.setAttribute('count', fixtures.length);
        return fixtures;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error finding recent results', { error, limit });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateLineup(id: string, lineupData: any, isHome: boolean, auditData: any): Promise<Fixture | null> {
    return tracer.startActiveSpan('repository.Fixture.updateLineup', async (span) => {
      try {
        span.setAttribute('id', id);
        span.setAttribute('isHome', isHome);
        
        const fixture = await this.findById(id);
        if (!fixture) {
          throw new Error('Fixture not found');
        }

        const updateData: any = {};
        if (isHome) {
          updateData.lineupHome = lineupData;
        } else {
          updateData.lineupAway = lineupData;
        }

        return await this.updateWithAudit(id, updateData, auditData);
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error updating fixture lineup: ${id}`, { error, lineupData, isHome });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateScore(id: string, homeScore: number, awayScore: number, auditData: any): Promise<Fixture | null> {
    return tracer.startActiveSpan('repository.Fixture.updateScore', async (span) => {
      try {
        span.setAttribute('id', id);
        span.setAttribute('homeScore', homeScore);
        span.setAttribute('awayScore', awayScore);
        
        const updateData: Partial<FixtureAttributes> = {
          homeScore,
          awayScore,
          status: FixtureStatus.COMPLETED
        };

        return await this.updateWithAudit(id, updateData, auditData);
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error updating fixture score: ${id}`, { error, homeScore, awayScore });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async updateArchiveStatus(id: string, archiveStatus: ArchiveStatus, availableAt?: Date, auditData: any): Promise<Fixture | null> {
    return tracer.startActiveSpan('repository.Fixture.updateArchiveStatus', async (span) => {
      try {
        span.setAttribute('id', id);
        span.setAttribute('archiveStatus', archiveStatus);
        if (availableAt) span.setAttribute('availableAt', availableAt.toISOString());
        
        const updateData: Partial<FixtureAttributes> = {
          archiveStatus,
          ...(availableAt && { availableAt })
        };

        return await this.updateWithAudit(id, updateData, auditData);
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error updating fixture archive status: ${id}`, { error, archiveStatus, availableAt });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findMatchArchives(filters: FixtureFilterOptions = {}, pagination?: { page: number; limit: number }): Promise<{ data: Fixture[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan('repository.Fixture.findMatchArchives', async (span) => {
      try {
        span.setAttribute('filters', JSON.stringify(filters));

        const where: any = {
          archiveStatus: ArchiveStatus.AVAILABLE,
          status: FixtureStatus.COMPLETED
        };
        
        // Apply filters
        if (filters.competition) {
          where.competition = filters.competition;
        }
        
        if (filters.dateFrom || filters.dateTo) {
          where.matchDate = {};
          if (filters.dateFrom) {
            where.matchDate[Op.gte] = filters.dateFrom;
          }
          if (filters.dateTo) {
            where.matchDate[Op.lte] = filters.dateTo;
          }
        }

        const options: FindOptions = {
          where,
          order: [['matchDate', 'DESC']]
        };

        if (pagination) {
          return await this.paginate(pagination.page, pagination.limit, options);
        } else {
          const data = await this.findAll(options);
          const total = await this.count({ where });
          return {
            data,
            total,
            page: 1,
            totalPages: 1
          };
        }
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error finding match archives', { error, filters });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async getLeagueTable(season?: string, competition?: string): Promise<any> {
    return tracer.startActiveSpan('repository.Fixture.getLeagueTable', async (span) => {
      try {
        span.setAttributes({
          season,
          competition
        });

        // This is a simplified implementation
        // In production, you would have a proper league table model or complex query
        
        const where: any = {
          status: FixtureStatus.COMPLETED
        };
        
        if (competition) {
          where.competition = competition;
        }
        
        // Filter by season if provided (format: YYYY-YYYY)
        if (season) {
          const [startYear, endYear] = season.split('-').map(Number);
          const startDate = new Date(startYear, 6, 1); // July 1st of start year
          const endDate = new Date(endYear, 5, 30); // June 30th of end year
          
          where.matchDate = {
            [Op.between]: [startDate, endDate]
          };
        }

        const fixtures = await this.findAll({
          where,
          order: [['matchDate', 'ASC']]
        });

        // Calculate league table from fixtures
        const leagueTable = this.calculateLeagueTable(fixtures);

        span.setAttribute('teams', leagueTable.teams?.length || 0);
        return leagueTable;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error getting league table', { error, season, competition });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  private calculateLeagueTable(fixtures: Fixture[]): any {
    const teams: Record<string, any> = {};

    fixtures.forEach(fixture => {
      const { homeTeam, awayTeam, homeScore, awayScore } = fixture;
      
      // Initialize teams if not exists
      if (!teams[homeTeam]) {
        teams[homeTeam] = this.initializeTeamStats(homeTeam);
      }
      if (!teams[awayTeam]) {
        teams[awayTeam] = this.initializeTeamStats(awayTeam);
      }

      // Update stats
      if (homeScore !== undefined && awayScore !== undefined) {
        // Home team stats
        teams[homeTeam].played++;
        teams[homeTeam].goalsFor += homeScore;
        teams[homeTeam].goalsAgainst += awayScore;
        teams[homeTeam].goalDifference = teams[homeTeam].goalsFor - teams[homeTeam].goalsAgainst;

        // Away team stats
        teams[awayTeam].played++;
        teams[awayTeam].goalsFor += awayScore;
        teams[awayTeam].goalsAgainst += homeScore;
        teams[awayTeam].goalDifference = teams[awayTeam].goalsFor - teams[awayTeam].goalsAgainst;

        // Determine result
        if (homeScore > awayScore) {
          // Home win
          teams[homeTeam].won++;
          teams[homeTeam].points += 3;
          teams[awayTeam].lost++;
          teams[homeTeam].form.push('W');
          teams[awayTeam].form.push('L');
        } else if (homeScore < awayScore) {
          // Away win
          teams[awayTeam].won++;
          teams[awayTeam].points += 3;
          teams[homeTeam].lost++;
          teams[awayTeam].form.push('W');
          teams[homeTeam].form.push('L');
        } else {
          // Draw
          teams[homeTeam].drawn++;
          teams[awayTeam].drawn++;
          teams[homeTeam].points += 1;
          teams[awayTeam].points += 1;
          teams[homeTeam].form.push('D');
          teams[awayTeam].form.push('D');
        }

        // Keep only last 5 form results
        if (teams[homeTeam].form.length > 5) {
          teams[homeTeam].form.shift();
        }
        if (teams[awayTeam].form.length > 5) {
          teams[awayTeam].form.shift();
        }
      }
    });

    // Convert to array and sort
    const teamArray = Object.values(teams).sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.localeCompare(b.team);
    });

    // Add positions
    const teamsWithPositions = teamArray.map((team: any, index) => ({
      ...team,
      position: index + 1
    }));

    return {
      teams: teamsWithPositions,
      updatedAt: new Date()
    };
  }

  private initializeTeamStats(teamName: string): any {
    return {
      team: teamName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: []
    };
  }

  async getDashboardStats(): Promise<{
    total: number;
    upcoming: number;
    completed: number;
    byStatus: Record<string, number>;
    byCompetition: Record<string, number>;
  }> {
    return tracer.startActiveSpan('repository.Fixture.getDashboardStats', async (span) => {
      try {
        const [total, upcoming, completed, byStatus, byCompetition] = await Promise.all([
          this.count(),
          this.count({
            where: {
              status: FixtureStatus.SCHEDULED,
              matchDate: { [Op.gte]: new Date() }
            }
          }),
          this.count({ where: { status: FixtureStatus.COMPLETED } }),
          this.model.findAll({
            attributes: ['status', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
            group: ['status']
          }),
          this.model.findAll({
            attributes: ['competition', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
            group: ['competition']
          })
        ]);

        const byStatusMap = (byStatus as any[]).reduce((acc, item) => {
          acc[item.status] = parseInt(item.get('count'));
          return acc;
        }, {});

        const byCompetitionMap = (byCompetition as any[]).reduce((acc, item) => {
          acc[item.competition] = parseInt(item.get('count'));
          return acc;
        }, {});

        span.setAttributes({
          total,
          upcoming,
          completed,
          statusCount: Object.keys(byStatusMap).length,
          competitionCount: Object.keys(byCompetitionMap).length
        });

        return {
          total,
          upcoming,
          completed,
          byStatus: byStatusMap,
          byCompetition: byCompetitionMap
        };
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error getting fixture dashboard stats', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async processArchives(): Promise<void> {
    return tracer.startActiveSpan('repository.Fixture.processArchives', async (span) => {
      try {
        const fixtures = await this.findAll({
          where: {
            status: FixtureStatus.COMPLETED,
            archiveStatus: ArchiveStatus.PROCESSING,
            availableAt: { [Op.lte]: new Date() }
          }
        });

        for (const fixture of fixtures) {
          await fixture.update({
            archiveStatus: ArchiveStatus.AVAILABLE
          });
          logger.info(`Fixture archive processed and made available: ${fixture.id}`);
        }

        span.setAttribute('processed', fixtures.length);
        logger.info(`Processed ${fixtures.length} fixture archives`);
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error('Error processing fixture archives', { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}