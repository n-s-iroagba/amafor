import { Model, ModelCtor, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import { logger } from '@utils/logger';
import { tracer } from '@utils/tracer';

export abstract class BaseRepository<T extends Model> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async findById(id: string, options?: FindOptions): Promise<T | null> {
    return tracer.startActiveSpan(`repository.${this.model.name}.findById`, async (span) => {
      try {
        span.setAttribute('id', id);
        const result = await this.model.findByPk(id, options);
        span.setAttribute('found', !!result);
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error finding ${this.model.name} by id: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return tracer.startActiveSpan(`repository.${this.model.name}.findAll`, async (span) => {
      try {
        const result = await this.model.findAll(options);
        span.setAttribute('count', result.length);
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error finding all ${this.model.name}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return tracer.startActiveSpan(`repository.${this.model.name}.findOne`, async (span) => {
      try {
        const result = await this.model.findOne(options);
        span.setAttribute('found', !!result);
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error finding one ${this.model.name}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async create(data: any, options?: CreateOptions): Promise<T> {
    return tracer.startActiveSpan(`repository.${this.model.name}.create`, async (span) => {
      try {
        span.setAttribute('data', JSON.stringify(data));
        const result = await this.model.create(data, options);
        logger.info(`${this.model.name} created: ${result.get('id')}`);
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error creating ${this.model.name}`, { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async update(id: string, data: any, options?: UpdateOptions): Promise<[number, T[]]> {
    return tracer.startActiveSpan(`repository.${this.model.name}.update`, async (span) => {
      try {
        span.setAttribute('id', id);
        span.setAttribute('data', JSON.stringify(data));
        const result = await this.model.update(data, {
          where: { id },
          returning: true,
          ...options
        });
        span.setAttribute('rowsUpdated', result[0]);
        logger.info(`${this.model.name} updated: ${id}`);
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error updating ${this.model.name}: ${id}`, { error, data });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async delete(id: string, options?: DestroyOptions): Promise<number> {
    return tracer.startActiveSpan(`repository.${this.model.name}.delete`, async (span) => {
      try {
        span.setAttribute('id', id);
        const result = await this.model.destroy({
          where: { id },
          ...options
        });
        span.setAttribute('rowsDeleted', result);
        logger.info(`${this.model.name} deleted: ${id}`);
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error deleting ${this.model.name}: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async count(options?: FindOptions): Promise<number> {
    return tracer.startActiveSpan(`repository.${this.model.name}.count`, async (span) => {
      try {
        const result = await this.model.count(options);
        span.setAttribute('count', result);
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error counting ${this.model.name}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async paginate(page: number = 1, limit: number = 20, options?: FindOptions): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
    return tracer.startActiveSpan(`repository.${this.model.name}.paginate`, async (span) => {
      try {
        const offset = (page - 1) * limit;
        const [data, total] = await Promise.all([
          this.model.findAll({ ...options, limit, offset }),
          this.model.count(options)
        ]);

        const totalPages = Math.ceil(total / limit);

        span.setAttributes({
          page,
          limit,
          total,
          totalPages,
          dataCount: data.length
        });

        return {
          data,
          total,
          page,
          totalPages
        };
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error paginating ${this.model.name}`, { error, page, limit });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async exists(id: string): Promise<boolean> {
    return tracer.startActiveSpan(`repository.${this.model.name}.exists`, async (span) => {
      try {
        span.setAttribute('id', id);
        const count = await this.model.count({ where: { id } });
        span.setAttribute('exists', count > 0);
        return count > 0;
      } catch (error) {
        span.setStatus({ code: 2, message: error.message });
        logger.error(`Error checking if ${this.model.name} exists: ${id}`, { error });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}