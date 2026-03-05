import FixtureStatistics, { FixtureStatisticsAttributes, FixtureStatisticsCreationAttributes } from '../models/FixtureStatistics';
import { AppError } from '../utils/errors';
import Fixture from '../models/Fixture';

export class FixtureStatisticsService {
    async getFixtureStatisticsByFixture(fixtureId: string | number, includeFixture = false): Promise<FixtureStatistics | null> {
        try {
            return await FixtureStatistics.findOne({
                where: { fixtureId: String(fixtureId) },
                include: includeFixture ? [{ model: Fixture, as: 'fixture' }] : []
            });
        } catch (error) {
            throw error;
        }
    }

    async getFixtureStatisticsById(id: string | number, includeFixture = false): Promise<FixtureStatistics | null> {
        try {
            const stats = await FixtureStatistics.findByPk(String(id), {
                include: includeFixture ? [{ model: Fixture, as: 'fixture' }] : []
            });
            if (!stats) throw new AppError('Fixture Statistics not found', 404);
            return stats;
        } catch (error) {
            throw error;
        }
    }

    async createFixtureStatistics(fixtureId: string | number, data: Partial<FixtureStatisticsCreationAttributes>): Promise<FixtureStatistics> {
        try {
            return await FixtureStatistics.create({ ...data, fixtureId: String(fixtureId) } as any);
        } catch (error) {
            throw error;
        }
    }

    async updateFixtureStatistics(id: string | number, data: Partial<FixtureStatisticsAttributes>): Promise<FixtureStatistics> {
        try {
            const stats = await FixtureStatistics.findByPk(String(id));
            if (!stats) throw new AppError('Fixture Statistics not found', 404);
            return await stats.update(data);
        } catch (error) {
            throw error;
        }
    }

    async deleteFixtureStatistics(id: string | number): Promise<void> {
        try {
            const stats = await FixtureStatistics.findByPk(String(id));
            if (!stats) throw new AppError('Fixture Statistics not found', 404);
            await stats.destroy();
        } catch (error) {
            throw error;
        }
    }
}
