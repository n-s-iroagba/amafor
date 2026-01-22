"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialistRepository = void 0;
const Trialist_1 = require("../models/Trialist");
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
class TrialistRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Trialist_1.Trialist);
    }
    async findByEmail(email) {
        return await this.model.findOne({ where: { email } });
    }
    async updateStatus(id, status) {
        return await this.update(id, { status });
    }
    async findByStatus(status) {
        return await this.model.findAll({ where: { status } });
    }
    async searchByKeyword(keyword) {
        return await this.model.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { firstName: { [sequelize_1.Op.iLike]: `%${keyword}%` } },
                    { lastName: { [sequelize_1.Op.iLike]: `%${keyword}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${keyword}%` } },
                    { position: { [sequelize_1.Op.iLike]: `%${keyword}%` } },
                    { previousClub: { [sequelize_1.Op.iLike]: `%${keyword}%` } },
                ],
            },
            order: [['createdAt', 'DESC']],
        });
    }
    async getStatistics() {
        const [total, pending, reviewed, invited, rejected] = await Promise.all([
            this.model.count(),
            this.model.count({ where: { status: 'PENDING' } }),
            this.model.count({ where: { status: 'REVIEWED' } }),
            this.model.count({ where: { status: 'INVITED' } }),
            this.model.count({ where: { status: 'REJECTED' } }),
        ]);
        return {
            total,
            pending,
            reviewed,
            invited,
            rejected,
        };
    }
    // Renamed from findAll to findAllFiltered to avoid conflict with base class
    async findAllFiltered(filter = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = options;
        const where = {};
        if (filter.status && filter.status !== 'all') {
            where.status = filter.status;
        }
        if (filter.position && filter.position !== 'all') {
            where.position = filter.position;
        }
        if (filter.search) {
            where[sequelize_1.Op.or] = [
                { firstName: { [sequelize_1.Op.iLike]: `%${filter.search}%` } },
                { lastName: { [sequelize_1.Op.iLike]: `%${filter.search}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${filter.search}%` } },
            ];
        }
        const offset = (page - 1) * limit;
        return await this.model.findAndCountAll({
            where,
            limit,
            offset,
            order: [[sortBy, sortOrder]],
        });
    }
}
exports.TrialistRepository = TrialistRepository;
//# sourceMappingURL=TrialistRepository.js.map