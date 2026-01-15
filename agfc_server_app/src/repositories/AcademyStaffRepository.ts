import { FindOptions, Op } from 'sequelize';
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
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { role: { [Op.like]: `%${searchTerm}%` } },
        { bio: { [Op.like]: `%${searchTerm}%` } }
      ]
    };
    
    return this.findByAttributes(where, options);
  }

  async findByExperienceRange(min: number, max: number, options?: FindOptions): Promise<AcademyStaff[]> {
    const where = {
      yearsOfExperience: {
        [Op.between]: [min, max]
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
      where[Op.or] = [
        { name: { [Op.like]: `%${options.searchTerm}%` } },
        { role: { [Op.like]: `%${options.searchTerm}%` } }
      ];
    }
    
    if (options.category) {
      where.category = options.category;
    }
    
    if (options.minExperience !== undefined) {
      where.yearsOfExperience = {
        ...where.yearsOfExperience,
        [Op.gte]: options.minExperience
      };
    }
    
    if (options.maxExperience !== undefined) {
      where.yearsOfExperience = {
        ...where.yearsOfExperience,
        [Op.lte]: options.maxExperience
      };
    }
    
    return this.findAll({ where, ...options });
  }
}