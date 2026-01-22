"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = __importDefault(require("@utils/tracer"));
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findById(id, options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.findById`, async (span) => {
            try {
                span.setAttribute('id', id);
                const result = await this.model.findByPk(id, options);
                span.setAttribute('found', !!result);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error finding ${this.model.name} by id: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findAll(options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.findAll`, async (span) => {
            try {
                const result = await this.model.findAll(options);
                span.setAttribute('count', result.length);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error finding all ${this.model.name}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findOne(options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.findOne`, async (span) => {
            try {
                const result = await this.model.findOne(options);
                span.setAttribute('found', !!result);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error finding one ${this.model.name}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async create(data, options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.create`, async (span) => {
            try {
                span.setAttribute('data', JSON.stringify(data));
                const result = await this.model.create(data, options);
                logger_1.default.info(`${this.model.name} created: ${result.get('id')}`);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error creating ${this.model.name}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async update(id, data, options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.update`, async (span) => {
            try {
                span.setAttribute('id', id);
                span.setAttribute('data', JSON.stringify(data));
                const result = await this.model.update(data, {
                    where: { id },
                    returning: true,
                    ...options
                });
                span.setAttribute('rowsUpdated', result[0]);
                logger_1.default.info(`${this.model.name} updated: ${id}`);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error updating ${this.model.name}: ${id}`, { error, data });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async delete(id, options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.delete`, async (span) => {
            try {
                span.setAttribute('id', id);
                const result = await this.model.destroy({
                    where: { id },
                    ...options
                });
                span.setAttribute('rowsDeleted', result);
                logger_1.default.info(`${this.model.name} deleted: ${id}`);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error deleting ${this.model.name}: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async count(options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.count`, async (span) => {
            try {
                const result = await this.model.count(options);
                span.setAttribute('count', result);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error counting ${this.model.name}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async paginate(page = 1, limit = 20, options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.paginate`, async (span) => {
            try {
                const offset = (page - 1) * limit;
                const [data, total] = await Promise.all([
                    this.model.findAll({ ...options, limit, offset }),
                    this.model.count(options)
                ]);
                const totalPages = Math.ceil(total / limit);
                const hasNext = page < totalPages;
                const hasPrevious = page > 1;
                span.setAttributes({
                    page,
                    limit,
                    total,
                    totalPages,
                    dataCount: data.length,
                    hasNext,
                    hasPrevious
                });
                return {
                    data,
                    total,
                    page,
                    limit,
                    totalPages,
                    hasNext,
                    hasPrevious
                };
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error paginating ${this.model.name}`, { error, page, limit });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async exists(id) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.exists`, async (span) => {
            try {
                span.setAttribute('id', id);
                const count = await this.model.count({ where: { id: id } });
                span.setAttribute('exists', count > 0);
                return count > 0;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error checking if ${this.model.name} exists: ${id}`, { error });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async bulkCreate(data, options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.bulkCreate`, async (span) => {
            try {
                span.setAttribute('count', data.length);
                const result = await this.model.bulkCreate(data, options);
                logger_1.default.info(`Bulk created ${result.length} ${this.model.name} records`);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error bulk creating ${this.model.name}`, { error, count: data.length });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async findByAttributes(where, options) {
        return tracer_1.default.startActiveSpan(`repository.${this.model.name}.findByAttributes`, async (span) => {
            try {
                const result = await this.model.findAll({ where, ...options });
                span.setAttribute('count', result.length);
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error(`Error finding ${this.model.name} by attributes`, { error, where });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map