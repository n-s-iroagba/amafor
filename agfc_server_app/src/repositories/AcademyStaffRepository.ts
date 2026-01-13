import { FindOptions } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import AcademyStaff from '@models/AcademyStaff';


export interface StaffFindOptions extends FindOptions {
  includeCategory?: boolean;
  searchTerm?: string;
  category?: string;
  minExperience?: number;
  maxExperience?: number;
}

export class AcademyStaffRepository extends BaseRepository<AcademyStaff> {
  constructor() {
    super(AcademyStaff as any);
  }

  async findByCategory(category: string, options?: FindOptions): Promise<AcademyStaff[]> {
    return this.findByAttributes({ category }, options);
  }

  async searchStaff(searchTerm: string, options?: FindOptions): Promise<AcademyStaff[]> {
    const where = {
      [this.model.sequelize!.Op.or]: [
        { name: { [this.model.sequelize!.Op.like]: `%${searchTerm}%` } },
        { role: { [this.model.sequelize!.Op.like]: `%${searchTerm}%` } },
        { bio: { [this.model.sequelize!.Op.like]: `%${searchTerm}%` } }
      ]
    };
    
    return this.findByAttributes(where, options);
  }

  async findByExperienceRange(min: number, max: number, options?: FindOptions): Promise<AcademyStaff[]> {
    const where = {
      yearsOfExperience: {
        [this.model.sequelize!.Op.between]: [min, max]
      }
    };
    
    return this.findByAttributes(where, options);
  }

  async getStaffStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    averageExperience: number;
    withQualifications: number;
  }> {
    const allStaff = await this.findAll();
    
    const byCategory = allStaff.reduce((acc, staff) => {
      const category = staff.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalExperience = allStaff.reduce((sum, staff) => 
      sum + (staff.yearsOfExperience || 0), 0);
    
    const averageExperience = allStaff.length > 0 
      ? totalExperience / allStaff.length 
      : 0;
    
    const withQualifications = allStaff.filter(staff => 
      staff.qualifications && staff.qualifications.length > 0
    ).length;
    
    return {
      total: allStaff.length,
      byCategory,
      averageExperience: Math.round(averageExperience * 10) / 10,
      withQualifications
    };
  }

  async getQualificationCounts(): Promise<Record<string, number>> {
    const allStaff = await this.findAll();
    const qualificationCounts: Record<string, number> = {};
    
    allStaff.forEach(staff => {
      if (staff.qualifications) {
        staff.qualifications.forEach((qual: string) => {
          qualificationCounts[qual] = (qualificationCounts[qual] || 0) + 1;
        });
      }
    });
    
    return qualificationCounts;
  }

  async findWithAdvancedOptions(options: StaffFindOptions): Promise<AcademyStaff[]> {
    const where: any = {};
    
    if (options.searchTerm) {
      where[this.model.sequelize!.Op.or] = [
        { name: { [this.model.sequelize!.Op.like]: `%${options.searchTerm}%` } },
        { role: { [this.model.sequelize!.Op.like]: `%${options.searchTerm}%` } }
      ];
    }
    
    if (options.category) {
      where.category = options.category;
    }
    
    if (options.minExperience !== undefined) {
      where.yearsOfExperience = {
        ...where.yearsOfExperience,
        [this.model.sequelize!.Op.gte]: options.minExperience
      };
    }
    
    if (options.maxExperience !== undefined) {
      where.yearsOfExperience = {
        ...where.yearsOfExperience,
        [this.model.sequelize!.Op.lte]: options.maxExperience
      };
    }
    
    return this.findAll({ where, ...options });
  }
}