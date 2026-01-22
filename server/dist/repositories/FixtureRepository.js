"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureRepository = void 0;
const sequelize_1 = require("sequelize");
const Fixture_1 = require("@models/Fixture");
const BaseRepository_1 = require("./BaseRepository");
const AuditLogRepository_1 = require("./AuditLogRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = require("@utils/tracer");
class FixtureRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Fixture_1.Fixture);
        this.auditLogRepository = new AuditLogRepository_1.AuditLogRepository();
    }
    async createWithAudit(data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.createWithAudit', async (span) => {
            const transaction = await Fixture_1.Fixture.sequelize.transaction();
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
                        newValue: data[key]
                    })),
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent
                }, { transaction });
                await transaction.commit();
                logger_1.default.info(`Fixture created with audit: ${fixture.id}`);
                return fixture;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error creating fixture with audit', { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateWithAudit(id, data, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.updateWithAudit', async (span) => {
            const transaction = await Fixture_1.Fixture.sequelize.transaction();
            try {
                span.setAttribute('id', id);
                const fixture = await this.findById(id, { transaction });
                if (!fixture) {
                    throw new Error('Fixture not found');
                }
                const oldValue = fixture.toJSON();
                // Update fixture
                await fixture.update({
                    ...data,
                    updatedById: auditData.userId
                }, { transaction });
                // Get changes
                const changes = Object.keys(data)
                    .filter(key => fixture.get(key) !== oldValue[key])
                    .map(key => ({
                    field: key,
                    oldValue: oldValue[key],
                    newValue: data[key]
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
                logger_1.default.info(`Fixture updated with audit: ${id}`);
                return fixture;
            }
            catch (error) {
                await transaction.rollback();
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating fixture with audit: ${id}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findWithFilters(filters, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.findWithFilters', async (span) => {
            try {
                span.setAttribute('filters', JSON.stringify(filters));
                const where = {};
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
                        where.matchDate[sequelize_1.Op.gte] = filters.dateFrom;
                    }
                    if (filters.dateTo) {
                        where.matchDate[sequelize_1.Op.lte] = filters.dateTo;
                    }
                }
                if (filters.search) {
                    where[sequelize_1.Op.or] = [
                        { homeTeam: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { awayTeam: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { competition: { [sequelize_1.Op.like]: `%${filters.search}%` } },
                        { venue: { [sequelize_1.Op.like]: `%${filters.search}%` } }
                    ];
                }
                const options = {
                    where,
                    order: [['matchDate', 'DESC']]
                };
                if (pagination) {
                    return await this.paginate(pagination.page, pagination.limit, options);
                }
                else {
                    const data = await this.findAll(options);
                    const total = await this.count({ where });
                    return {
                        data,
                        total,
                        page: 1,
                        totalPages: 1
                    };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding fixtures with filters', { error, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findUpcoming(limit = 10) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.findUpcoming', async (span) => {
            try {
                span.setAttribute('limit', limit);
                const fixtures = await this.findAll({
                    where: {
                        status: Fixture_1.FixtureStatus.SCHEDULED,
                        matchDate: { [sequelize_1.Op.gte]: new Date() }
                    },
                    order: [['matchDate', 'ASC']],
                    limit
                });
                span.setAttribute('count', fixtures.length);
                return fixtures;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding upcoming fixtures', { error, limit });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findRecentResults(limit = 10) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.findRecentResults', async (span) => {
            try {
                span.setAttribute('limit', limit);
                const fixtures = await this.findAll({
                    where: {
                        status: Fixture_1.FixtureStatus.COMPLETED
                    },
                    order: [['matchDate', 'DESC']],
                    limit
                });
                span.setAttribute('count', fixtures.length);
                return fixtures;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding recent results', { error, limit });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateLineup(id, lineupData, isHome, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.updateLineup', async (span) => {
            try {
                span.setAttribute('id', id);
                span.setAttribute('isHome', isHome);
                const fixture = await this.findById(id);
                if (!fixture) {
                    throw new Error('Fixture not found');
                }
                const updateData = {};
                if (isHome) {
                    updateData.lineupHome = lineupData;
                }
                else {
                    updateData.lineupAway = lineupData;
                }
                return await this.updateWithAudit(id, updateData, auditData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating fixture lineup: ${id}`, { error, lineupData, isHome });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateScore(id, homeScore, awayScore, auditData) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.updateScore', async (span) => {
            try {
                span.setAttribute('id', id);
                span.setAttribute('homeScore', homeScore);
                span.setAttribute('awayScore', awayScore);
                const updateData = {
                    homeScore,
                    awayScore,
                    status: Fixture_1.FixtureStatus.COMPLETED
                };
                return await this.updateWithAudit(id, updateData, auditData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating fixture score: ${id}`, { error, homeScore, awayScore });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateArchiveStatus(id, archiveStatus, auditData, availableAt) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.updateArchiveStatus', async (span) => {
            try {
                span.setAttribute('id', id);
                span.setAttribute('archiveStatus', archiveStatus);
                if (availableAt)
                    span.setAttribute('availableAt', availableAt.toISOString());
                const updateData = {
                    archiveStatus,
                    ...(availableAt && { availableAt })
                };
                return await this.updateWithAudit(id, updateData, auditData);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error(`Error updating fixture archive status: ${id}`, { error, archiveStatus, availableAt });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findFixtureArchives(filters = {}, pagination) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.findFixtureArchives', async (span) => {
            try {
                span.setAttribute('filters', JSON.stringify(filters));
                const where = {
                    archiveStatus: Fixture_1.ArchiveStatus.AVAILABLE,
                    status: Fixture_1.FixtureStatus.COMPLETED
                };
                // Apply filters
                if (filters.competition) {
                    where.competition = filters.competition;
                }
                if (filters.dateFrom || filters.dateTo) {
                    where.matchDate = {};
                    if (filters.dateFrom) {
                        where.matchDate[sequelize_1.Op.gte] = filters.dateFrom;
                    }
                    if (filters.dateTo) {
                        where.matchDate[sequelize_1.Op.lte] = filters.dateTo;
                    }
                }
                const options = {
                    where,
                    order: [['matchDate', 'DESC']]
                };
                if (pagination) {
                    return await this.paginate(pagination.page, pagination.limit, options);
                }
                else {
                    const data = await this.findAll(options);
                    const total = await this.count({ where });
                    return {
                        data,
                        total,
                        page: 1,
                        totalPages: 1
                    };
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error finding match archives', { error, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getLeagueTable(season, competition) {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.getLeagueTable', async (span) => {
            try {
                span.setAttributes({
                    season,
                    competition
                });
                // This is a simplified implementation
                // In production, you would have a proper league table model or complex query
                const where = {
                    status: Fixture_1.FixtureStatus.COMPLETED
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
                        [sequelize_1.Op.between]: [startDate, endDate]
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting league table', { error, season, competition });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    calculateLeagueTable(fixtures) {
        const teams = {};
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
                }
                else if (homeScore < awayScore) {
                    // Away win
                    teams[awayTeam].won++;
                    teams[awayTeam].points += 3;
                    teams[homeTeam].lost++;
                    teams[awayTeam].form.push('W');
                    teams[homeTeam].form.push('L');
                }
                else {
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
        const teamArray = Object.values(teams).sort((a, b) => {
            if (b.points !== a.points)
                return b.points - a.points;
            if (b.goalDifference !== a.goalDifference)
                return b.goalDifference - a.goalDifference;
            if (b.goalsFor !== a.goalsFor)
                return b.goalsFor - a.goalsFor;
            return a.team.localeCompare(b.team);
        });
        // Add positions
        const teamsWithPositions = teamArray.map((team, index) => ({
            ...team,
            position: index + 1
        }));
        return {
            teams: teamsWithPositions,
            updatedAt: new Date()
        };
    }
    initializeTeamStats(teamName) {
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
    async getDashboardStats() {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.getDashboardStats', async (span) => {
            try {
                const [total, upcoming, completed, byStatus, byCompetition] = await Promise.all([
                    this.count(),
                    this.count({
                        where: {
                            status: Fixture_1.FixtureStatus.SCHEDULED,
                            matchDate: { [sequelize_1.Op.gte]: new Date() }
                        }
                    }),
                    this.count({ where: { status: Fixture_1.FixtureStatus.COMPLETED } }),
                    this.model.findAll({
                        attributes: ['status', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        group: ['status']
                    }),
                    this.model.findAll({
                        attributes: ['competition', [this.model.sequelize.fn('COUNT', this.model.sequelize.col('id')), 'count']],
                        group: ['competition']
                    })
                ]);
                const byStatusMap = byStatus.reduce((acc, item) => {
                    acc[item.status] = parseInt(item.get('count'));
                    return acc;
                }, {});
                const byCompetitionMap = byCompetition.reduce((acc, item) => {
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error getting fixture dashboard stats', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async processArchives() {
        return tracer_1.tracer.startActiveSpan('repository.Fixture.processArchives', async (span) => {
            try {
                const fixtures = await this.findAll({
                    where: {
                        status: Fixture_1.FixtureStatus.COMPLETED,
                        archiveStatus: Fixture_1.ArchiveStatus.PROCESSING,
                        availableAt: { [sequelize_1.Op.lte]: new Date() }
                    }
                });
                for (const fixture of fixtures) {
                    await fixture.update({
                        archiveStatus: Fixture_1.ArchiveStatus.AVAILABLE
                    });
                    logger_1.default.info(`Fixture archive processed and made available: ${fixture.id}`);
                }
                span.setAttribute('processed', fixtures.length);
                logger_1.default.info(`Processed ${fixtures.length} fixture archives`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                span.setStatus({ code: 2, message: errorMessage });
                logger_1.default.error('Error processing fixture archives', { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.FixtureRepository = FixtureRepository;
//# sourceMappingURL=FixtureRepository.js.map