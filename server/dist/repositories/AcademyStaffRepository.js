"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademyStaffRepository = void 0;
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const AcademyStaff_1 = __importDefault(require("@models/AcademyStaff"));
class AcademyStaffRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(AcademyStaff_1.default);
    }
    async findByCategory(category, options) {
        return this.findByAttributes({ category }, options);
    }
    async searchStaff(searchTerm, options) {
        const where = {
            [sequelize_1.Op.or]: [
                { name: { [sequelize_1.Op.like]: `%${searchTerm}%` } },
                { role: { [sequelize_1.Op.like]: `%${searchTerm}%` } },
                { bio: { [sequelize_1.Op.like]: `%${searchTerm}%` } }
            ]
        };
        return this.findByAttributes(where, options);
    }
    async findByExperienceRange(min, max, options) {
        const where = {
            yearsOfExperience: {
                [sequelize_1.Op.between]: [min, max]
            }
        };
        return this.findByAttributes(where, options);
    }
    async getStaffStats() {
        const allStaff = await this.findAll();
        const byCategory = allStaff.reduce((acc, staff) => {
            const category = staff.category || 'uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        const totalExperience = allStaff.reduce((sum, staff) => sum + (staff.yearsOfExperience || 0), 0);
        const averageExperience = allStaff.length > 0
            ? totalExperience / allStaff.length
            : 0;
        const withQualifications = allStaff.filter(staff => staff.qualifications && staff.qualifications.length > 0).length;
        return {
            total: allStaff.length,
            byCategory,
            averageExperience: Math.round(averageExperience * 10) / 10,
            withQualifications
        };
    }
    async getQualificationCounts() {
        const allStaff = await this.findAll();
        const qualificationCounts = {};
        allStaff.forEach(staff => {
            if (staff.qualifications) {
                staff.qualifications.forEach((qual) => {
                    qualificationCounts[qual] = (qualificationCounts[qual] || 0) + 1;
                });
            }
        });
        return qualificationCounts;
    }
    async findWithAdvancedOptions(options) {
        const where = {};
        if (options.searchTerm) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${options.searchTerm}%` } },
                { role: { [sequelize_1.Op.like]: `%${options.searchTerm}%` } }
            ];
        }
        if (options.category) {
            where.category = options.category;
        }
        if (options.minExperience !== undefined) {
            where.yearsOfExperience = {
                ...where.yearsOfExperience,
                [sequelize_1.Op.gte]: options.minExperience
            };
        }
        if (options.maxExperience !== undefined) {
            where.yearsOfExperience = {
                ...where.yearsOfExperience,
                [sequelize_1.Op.lte]: options.maxExperience
            };
        }
        return this.findAll({ where, ...options });
    }
}
exports.AcademyStaffRepository = AcademyStaffRepository;
//# sourceMappingURL=AcademyStaffRepository.js.map