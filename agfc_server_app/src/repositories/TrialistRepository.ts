import { Trialist, TrialistAttributes, TrialistCreationAttributes } from '../models/Trialist';

import { Op } from 'sequelize';
import { BaseRepository } from './BaseRepository';

export interface ITrialistRepository {
  create(data: TrialistCreationAttributes): Promise<Trialist>;
  findAll(filter?: any, options?: any): Promise<{ rows: Trialist[]; count: number }>;
  findById(id: string): Promise<Trialist | null>;
  findByEmail(email: string): Promise<Trialist | null>;
  update(id: string, data: Partial<TrialistAttributes>): Promise<[number, Trialist[]]>;
  delete(id: string): Promise<number>;
  updateStatus(id: string, status: TrialistAttributes['status']): Promise<[number, Trialist[]]>;
  findByStatus(status: TrialistAttributes['status']): Promise<Trialist[]>;
  searchByKeyword(keyword: string): Promise<Trialist[]>;
  getStatistics(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    invited: number;
    rejected: number;
  }>;
}

export class TrialistRepository extends BaseRepository<Trialist> implements ITrialistRepository {
  constructor() {
    super(Trialist);
  }

  async findByEmail(email: string): Promise<Trialist | null> {
    return await this.model.findOne({ where: { email } });
  }

  async updateStatus(id: string, status: TrialistAttributes['status']): Promise<[number, Trialist[]]> {
    return await this.update(id, { status });
  }

  async findByStatus(status: TrialistAttributes['status']): Promise<Trialist[]> {
    return await this.model.findAll({ where: { status } });
  }

  async searchByKeyword(keyword: string): Promise<Trialist[]> {
    return await this.model.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${keyword}%` } },
          { lastName: { [Op.iLike]: `%${keyword}%` } },
          { email: { [Op.iLike]: `%${keyword}%` } },
          { position: { [Op.iLike]: `%${keyword}%` } },
          { previousClub: { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async getStatistics(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    invited: number;
    rejected: number;
  }> {
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

  async findAll(
    filter: {
      status?: string;
      position?: string;
      search?: string;
    } = {},
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    } = {}
  ): Promise<{ rows: Trialist[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = options;

    const where: any = {};

    if (filter.status && filter.status !== 'all') {
      where.status = filter.status;
    }

    if (filter.position && filter.position !== 'all') {
      where.position = filter.position;
    }

    if (filter.search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${filter.search}%` } },
        { lastName: { [Op.iLike]: `%${filter.search}%` } },
        { email: { [Op.iLike]: `%${filter.search}%` } },
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