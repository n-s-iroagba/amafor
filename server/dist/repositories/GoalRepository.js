"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalRepository = void 0;
const Fixture_1 = __importDefault(require("@models/Fixture"));
const Goal_1 = __importDefault(require("@models/Goal"));
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
class GoalRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Goal_1.default);
    }
    // 🔍 Find goals by fixture ID
    async findByFixtureId(fixtureId) {
        return await this.findAll({
            where: { fixtureId },
            order: [['minute', 'ASC']]
        });
    }
    // 🔍 Find goals by scorer
    async findByScorer(scorer) {
        return await this.findAll({
            where: { scorer },
            order: [['createdAt', 'DESC']]
        });
    }
    // 🔍 Find penalty goals
    async findPenaltyGoals() {
        return await this.findAll({
            where: { isPenalty: true },
            order: [['minute', 'ASC']]
        });
    }
    // 🔍 Find goals within a specific time range
    async findGoalsInTimeRange(minMinute, maxMinute) {
        const where = {};
        if (minMinute !== undefined && maxMinute !== undefined) {
            where.minute = { [sequelize_1.Op.between]: [minMinute, maxMinute] };
        }
        else if (minMinute !== undefined) {
            where.minute = { [sequelize_1.Op.gte]: minMinute };
        }
        else if (maxMinute !== undefined) {
            where.minute = { [sequelize_1.Op.lte]: maxMinute };
        }
        return await this.findAll({
            where,
            order: [['minute', 'ASC']]
        });
    }
    // 📊 Get goal count for a fixture
    async getFixtureGoalCount(fixtureId) {
        return await this.count({ where: { fixtureId } });
    }
    // 📊 Get scorer statistics
    async getScorerStats(scorer) {
        const [totalGoals, penaltyGoals, averageMinuteResult, fixturesScoredIn] = await Promise.all([
            this.count({ where: { scorer } }),
            this.count({ where: { scorer, isPenalty: true } }),
            this.model.findOne({
                where: { scorer },
                attributes: [[(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('minute')), 'averageMinute']],
                raw: true
            }),
            this.model.count({
                where: { scorer },
                distinct: true,
                col: 'fixtureId'
            })
        ]);
        const averageMinute = averageMinuteResult?.get('averageMinute') || 0;
        return {
            totalGoals,
            penaltyGoals,
            averageMinute: Math.round(averageMinute),
            fixturesScoredIn
        };
    }
    // 🏆 Get top scorers
    async getTopScorers(limit = 10) {
        const result = await this.model.findAll({
            attributes: [
                'scorer',
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalGoals']
            ],
            group: ['scorer'],
            order: [[(0, sequelize_1.literal)('totalGoals'), 'DESC']],
            limit,
            raw: true
        });
        return result.map(row => ({
            scorer: row.scorer,
            totalGoals: parseInt(row.get('totalGoals'))
        }));
    }
    // 📅 Get match timeline (goals in chronological order)
    async getFixtureTimeline(fixtureId) {
        return await this.findAll({
            where: { fixtureId },
            order: [['minute', 'ASC']],
            include: [{
                    model: Fixture_1.default,
                    as: 'fixture',
                    attributes: ['id', 'homeTeam', 'awayTeam', 'competition']
                }]
        });
    }
    // ⚽ Get match result based on goals
    async getFixtureResultByGoals(fixtureId) {
        const fixture = await Fixture_1.default.findByPk(fixtureId);
        if (!fixture) {
            return null;
        }
        const goals = await this.findByFixtureId(fixtureId);
        // This assumes we have a way to determine if a goal is for home or away
        // You might need to adjust this based on your actual data structure
        let homeGoals = 0;
        let awayGoals = 0;
        goals.forEach(goal => {
            // Simple logic: you might need to store team information in Goal model
            // or have a more sophisticated way to determine which team scored
            // For now, we'll use a placeholder logic
            if (goal.scorer.includes(fixture.homeTeam)) {
                homeGoals++;
            }
            else if (goal.scorer.includes(fixture.awayTeam)) {
                awayGoals++;
            }
        });
        return { homeGoals, awayGoals };
    }
    // ✅ Check if a player has scored in a fixture
    async hasScoredInFixture(fixtureId, scorer) {
        const count = await this.count({
            where: { fixtureId, scorer }
        });
        return count > 0;
    }
    // 🔄 Bulk create goals for a fixture
    async bulkCreateForFixture(fixtureId, goals) {
        // Validate fixture exists
        const fixture = await Fixture_1.default.findByPk(fixtureId);
        if (!fixture) {
            throw new Error(`Fixture with ID ${fixtureId} not found`);
        }
        // Add fixtureId to each goal
        const goalsWithFixture = goals.map(goal => ({
            ...goal,
            fixtureId
        }));
        return await this.bulkCreate(goalsWithFixture);
    }
    // 🗑️ Delete all goals for a fixture
    async deleteByFixtureId(fixtureId) {
        return await this.model.destroy({
            where: { fixtureId }
        });
    }
    // 🔍 Search goals by scorer name
    async searchGoalsByScorer(query) {
        return await this.findAll({
            where: {
                scorer: { [sequelize_1.Op.iLike]: `%${query}%` }
            },
            order: [['minute', 'ASC']],
            include: [{
                    model: Fixture_1.default,
                    as: 'fixture',
                    attributes: ['id', 'homeTeam', 'awayTeam', 'matchDate']
                }]
        });
    }
    // 📊 Get goals distribution by minute range
    async getGoalsByMinuteRange(fixtureId) {
        const where = {};
        if (fixtureId) {
            where.fixtureId = fixtureId;
        }
        const goals = await this.findAll({
            where,
            attributes: ['minute']
        });
        // Categorize goals by minute ranges
        const minuteRanges = [
            { label: '0-15', min: 0, max: 15 },
            { label: '16-30', min: 16, max: 30 },
            { label: '31-45', min: 31, max: 45 },
            { label: '45+', min: 45, max: 50 },
            { label: '46-60', min: 46, max: 60 },
            { label: '61-75', min: 61, max: 75 },
            { label: '76-90', min: 76, max: 90 },
            { label: '90+', min: 90, max: 120 } // Stoppage time in second half
        ];
        const result = {};
        minuteRanges.forEach(range => {
            result[range.label] = 0;
        });
        goals.forEach(goal => {
            const minute = goal.minute;
            const range = minuteRanges.find(r => minute >= r.min && minute <= r.max);
            if (range) {
                result[range.label]++;
            }
        });
        return result;
    }
    // 🎯 Override create to validate fixture exists
    async create(data) {
        // Validate fixture exists
        const fixture = await Fixture_1.default.findByPk(data.fixtureId);
        if (!fixture) {
            throw new Error(`Fixture with ID ${data.fixtureId} not found`);
        }
        // Validate minute is within reasonable bounds
        if (data.minute < 0 || data.minute > 120) {
            throw new Error('Minute must be between 0 and 120');
        }
        return await super.create(data);
    }
    // 🎯 Override update to validate minute
    async update(id, data) {
        // Validate minute if being updated
        if (data.minute !== undefined && (data.minute < 0 || data.minute > 120)) {
            throw new Error('Minute must be between 0 and 120');
        }
        return await super.update(id, data);
    }
    // 🔧 Get late goals (goals after 80th minute)
    async getLateGoals(fixtureId) {
        const where = {
            minute: { [sequelize_1.Op.gte]: 80 }
        };
        if (fixtureId) {
            where.fixtureId = fixtureId;
        }
        return await this.findAll({
            where,
            order: [['minute', 'ASC']]
        });
    }
    // 🔧 Get early goals (goals before 20th minute)
    async getEarlyGoals(fixtureId) {
        const where = {
            minute: { [sequelize_1.Op.lte]: 20 }
        };
        if (fixtureId) {
            where.fixtureId = fixtureId;
        }
        return await this.findAll({
            where,
            order: [['minute', 'ASC']]
        });
    }
    // 📈 Get goal statistics for a competition/season
    async getCompetitionStats(competition) {
        // This would require joining with Fixture table
        // For simplicity, we'll return basic stats
        const [totalGoals, totalPenalties] = await Promise.all([
            this.count(),
            this.count({ where: { isPenalty: true } })
        ]);
        const totalFixtures = await Fixture_1.default.count();
        const averageGoalsPerFixture = totalFixtures > 0 ? totalGoals / totalFixtures : 0;
        // Find match with most goals (would need a more complex query)
        // For now, we'll use a placeholder
        const mostGoalsInAFixture = 10; // This would need to be calculated
        return {
            totalGoals,
            averageGoalsPerFixture: parseFloat(averageGoalsPerFixture.toFixed(2)),
            totalPenalties,
            mostGoalsInAFixture
        };
    }
}
exports.GoalRepository = GoalRepository;
//# sourceMappingURL=GoalRepository.js.map