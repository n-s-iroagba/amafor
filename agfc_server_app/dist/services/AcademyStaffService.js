"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademyStaffService = void 0;
const AcademyStaff_1 = __importDefault(require("@models/AcademyStaff"));
const AcademyStaffRepository_1 = require("@repositories/AcademyStaffRepository");
const logger_1 = __importDefault(require("@utils/logger"));
const tracer_1 = __importDefault(require("@utils/tracer"));
const AuditService_1 = require("./AuditService");
class AcademyStaffService {
    constructor() {
        this.staffRepository = new AcademyStaffRepository_1.AcademyStaffRepository();
        this.auditService = new AuditService_1.AuditService();
    }
    async createStaff(data, userId) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.createStaff', async (span) => {
            try {
                span.setAttributes({
                    staffName: data.name,
                    userId,
                    role: data.role
                });
                // Generate initials if not provided
                if (!data.initials) {
                    data.initials = data.name
                        .split(' ')
                        .map(part => part.charAt(0).toUpperCase())
                        .join('')
                        .slice(0, 2);
                }
                // Validate category
                const validCategories = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];
                if (data.category && !validCategories.includes(data.category)) {
                    throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
                }
                const staff = await this.staffRepository.create(data);
                // Audit log
                await this.auditService.logAction({
                    userId,
                    userType: 'admin',
                    action: 'CREATE',
                    entityType: 'STAFF',
                    entityId: staff.id,
                    entityName: staff.name,
                    changes: Object.keys(data).map(field => ({
                        field,
                        newValue: data[field]
                    })),
                    ipAddress: '0.0.0.0',
                    metadata: { role: data.role, category: data.category }
                });
                logger_1.default.info('STAFF_CREATED', {
                    staffId: staff.id,
                    name: staff.name,
                    role: staff.role,
                    userId
                });
                return staff;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_CREATE_ERROR', {
                    error: error.message,
                    data,
                    userId
                });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getStaffById(id) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.getStaffById', async (span) => {
            try {
                span.setAttribute('staffId', id);
                return await this.staffRepository.findById(id, {
                    attributes: { exclude: ['deletedAt'] }
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_FETCH_ERROR', { error: error.message, staffId: id });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getAllStaff(filters = {}) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.getAllStaff', async (span) => {
            try {
                const { page = 1, limit = 20, category, searchTerm, minExperience, maxExperience, sortBy = 'name', sortOrder = 'asc' } = filters;
                const where = {};
                if (category)
                    where.category = category;
                if (searchTerm) {
                    where[AcademyStaff_1.default.sequelize.Op.or] = [
                        { name: { [AcademyStaff_1.default.sequelize.Op.like]: `%${searchTerm}%` } },
                        { role: { [AcademyStaff_1.default.sequelize.Op.like]: `%${searchTerm}%` } }
                    ];
                }
                if (minExperience !== undefined || maxExperience !== undefined) {
                    where.yearsOfExperience = {};
                    if (minExperience !== undefined) {
                        where.yearsOfExperience[AcademyStaff_1.default.sequelize.Op.gte] = minExperience;
                    }
                    if (maxExperience !== undefined) {
                        where.yearsOfExperience[AcademyStaff_1.default.sequelize.Op.lte] = maxExperience;
                    }
                }
                const order = [[sortBy, sortOrder]];
                const result = await this.staffRepository.paginate(page, limit, {
                    where,
                    order,
                    attributes: { exclude: ['deletedAt'] }
                });
                span.setAttributes({
                    page,
                    limit,
                    total: result.total,
                    filteredCount: result.data.length
                });
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_LIST_ERROR', { error: error.message, filters });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async updateStaff(id, data, userId) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.updateStaff', async (span) => {
            try {
                span.setAttributes({
                    staffId: id,
                    userId
                });
                // Get existing staff to log changes
                const existingStaff = await this.getStaffById(id);
                if (!existingStaff) {
                    throw new Error('Staff member not found');
                }
                // Validate category if provided
                if (data.category) {
                    const validCategories = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];
                    if (!validCategories.includes(data.category)) {
                        throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
                    }
                }
                const [updatedCount, updatedStaff] = await this.staffRepository.update(id, data);
                if (updatedCount === 0) {
                    throw new Error('Staff member not found or no changes made');
                }
                // Log changes for audit
                const changes = Object.keys(data)
                    .filter(key => data[key] !== existingStaff[key])
                    .map(field => ({
                    field,
                    oldValue: existingStaff[field],
                    newValue: data[field]
                }));
                if (changes.length > 0) {
                    await this.auditService.logAction({
                        userId,
                        userType: 'admin',
                        action: 'UPDATE',
                        entityType: 'STAFF',
                        entityId: id,
                        entityName: existingStaff.name,
                        changes,
                        ipAddress: '0.0.0.0',
                        metadata: { updateFields: Object.keys(data) }
                    });
                }
                logger_1.default.info('STAFF_UPDATED', {
                    staffId: id,
                    changes: changes.length,
                    userId
                });
                return updatedStaff[0];
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_UPDATE_ERROR', {
                    error: error.message,
                    staffId: id,
                    data,
                    userId
                });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async deleteStaff(id, userId) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.deleteStaff', async (span) => {
            try {
                span.setAttributes({
                    staffId: id,
                    userId
                });
                const staff = await this.getStaffById(id);
                if (!staff) {
                    throw new Error('Staff member not found');
                }
                const deletedCount = await this.staffRepository.delete(id);
                if (deletedCount === 0) {
                    throw new Error('Failed to delete staff member');
                }
                // Audit log
                await this.auditService.logAction({
                    userId,
                    userType: 'admin',
                    action: 'DELETE',
                    entityType: 'STAFF',
                    entityId: id,
                    entityName: staff.name,
                    changes: [],
                    ipAddress: '0.0.0.0',
                    metadata: {
                        role: staff.role,
                        category: staff.category,
                        experience: staff.yearsOfExperience
                    }
                });
                logger_1.default.info('STAFF_DELETED', {
                    staffId: id,
                    name: staff.name,
                    userId
                });
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_DELETE_ERROR', {
                    error: error.message,
                    staffId: id,
                    userId
                });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getStaffStats() {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.getStaffStats', async (span) => {
            try {
                const stats = await this.staffRepository.getStaffStats();
                const qualificationCounts = await this.staffRepository.getQualificationCounts();
                // Get top 5 qualifications
                const topQualifications = Object.entries(qualificationCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([qualification, count]) => ({ qualification, count }));
                const result = {
                    ...stats,
                    topQualifications
                };
                span.setAttributes({
                    totalStaff: stats.total,
                    categories: Object.keys(stats.byCategory).length,
                    averageExperience: stats.averageExperience
                });
                return result;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_STATS_ERROR', { error: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async searchStaffByName(name) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.searchStaffByName', async (span) => {
            try {
                span.setAttribute('searchName', name);
                const staff = await this.staffRepository.searchStaff(name, {
                    attributes: { exclude: ['deletedAt'] },
                    limit: 10
                });
                span.setAttribute('results', staff.length);
                return staff;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_SEARCH_ERROR', { error: error.message, name });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async getStaffByCategory(category) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.getStaffByCategory', async (span) => {
            try {
                span.setAttribute('category', category);
                const staff = await this.staffRepository.findByCategory(category, {
                    attributes: { exclude: ['deletedAt'] },
                    order: [['name', 'ASC']]
                });
                span.setAttribute('count', staff.length);
                return staff;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_CATEGORY_ERROR', { error: error.message, category });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async bulkImportStaff(staffData, userId) {
        return tracer_1.default.startActiveSpan('service.AcademyStaffService.bulkImportStaff', async (span) => {
            try {
                span.setAttribute('importCount', staffData.length);
                // Validate all records
                const validCategories = ['coaching', 'medical', 'administrative', 'technical', 'scouting'];
                const invalidRecords = [];
                staffData.forEach((data, index) => {
                    if (data.category && !validCategories.includes(data.category)) {
                        invalidRecords.push(`Record ${index + 1}: Invalid category "${data.category}"`);
                    }
                });
                if (invalidRecords.length > 0) {
                    throw new Error(`Invalid data: ${invalidRecords.join(', ')}`);
                }
                // Generate initials for records without them
                const processedData = staffData.map(data => ({
                    ...data,
                    initials: data.initials || data.name
                        .split(' ')
                        .map(part => part.charAt(0).toUpperCase())
                        .join('')
                        .slice(0, 2)
                }));
                const importedStaff = await this.staffRepository.bulkCreate(processedData);
                // Audit log for bulk import
                await this.auditService.logAction({
                    userId,
                    userType: 'admin',
                    action: 'BULK_IMPORT',
                    entityType: 'STAFF',
                    entityId: 'bulk_import',
                    entityName: `${importedStaff.length} staff members`,
                    changes: [],
                    ipAddress: '0.0.0.0',
                    metadata: {
                        count: importedStaff.length,
                        categories: [...new Set(staffData.map(s => s.category))].filter(Boolean)
                    }
                });
                logger_1.default.info('STAFF_BULK_IMPORTED', {
                    count: importedStaff.length,
                    userId
                });
                return importedStaff;
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                logger_1.default.error('STAFF_BULK_IMPORT_ERROR', {
                    error: error.message,
                    count: staffData.length,
                    userId
                });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
}
exports.AcademyStaffService = AcademyStaffService;
//# sourceMappingURL=AcademyStaffService.js.map