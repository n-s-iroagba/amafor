import { BaseRepository } from './BaseRepository';
import { Trialist, TrialistCreationAttributes } from '../models';
import { Op } from 'sequelize';

export class TrialistRepository extends BaseRepository<Trialist> {
  constructor() {
    super(Trialist);
  }

  // Custom method: Find by application status
  public async findByStatus(status: string): Promise<Trialist[]> {
    return await this.model.findAll({
      where: { status },
      order: [['createdAt', 'DESC']],
    });
  }

  // Custom method: Spam prevention check
  public async findRecentApplication(email: string, days: number = 30): Promise<Trialist | null> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    // @ts-ignore: Sequelize typings sometimes conflict with complex where clauses in strict mode
    return await this.model.findOne({
      where: {
        email,
        createdAt: {
          [Op.gte]: dateLimit,
        },
      },
    });
  }
}