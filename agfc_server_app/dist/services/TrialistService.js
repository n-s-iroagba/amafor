"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialistService = void 0;
const TrialistRepository_1 = require("@repositories/TrialistRepository");
const uuid_1 = require("uuid");
class TrialistService {
    constructor(repository) {
        this.repository = repository || new TrialistRepository_1.TrialistRepository();
    }
    async createTrialist(data) {
        // Check if email already exists
        const existingTrialist = await this.repository.findByEmail(data.email);
        if (existingTrialist) {
            throw new AppError('A trialist with this email already exists', 409);
        }
        // Validate age (must be at least 14 years old)
        const age = this.calculateAge(new Date(data.dob));
        if (age < 14) {
            throw new AppError('Trialist must be at least 14 years old', 400);
        }
        const trialistData = {
            ...data,
            id: (0, uuid_1.v4)(),
            videoUrl: uploads.videoUrl,
            cvUrl: uploads.cvUrl,
            status: data.status || 'PENDING',
        };
        return await this.repository.create(trialistData);
    }
    async getTrialistById(id) {
        const trialist = await this.repository.findById(id);
        if (!trialist) {
            throw new AppError('Trialist not found', 404);
        }
        return trialist;
    }
    async getAllTrialists(filters = {}, options = {}) {
        const { rows: trialists, count: total } = await this.repository.findAll(filters, options);
        const page = options.page || 1;
        const limit = options.limit || 10;
        const totalPages = Math.ceil(total / limit);
        return {
            trialists,
            total,
            page,
            totalPages,
        };
    }
    async updateTrialist(id, data) {
        const trialist = await this.repository.findById(id);
        if (!trialist) {
            throw new AppError('Trialist not found', 404);
        }
        // Check if email is being changed and if it's already taken
        if (data.email && data.email !== trialist.email) {
            const existingTrialist = await this.repository.findByEmail(data.email);
            if (existingTrialist && existingTrialist.id !== id) {
                throw new AppError('A trialist with this email already exists', 409);
            }
        }
        // Validate age if dob is being updated
        if (data.dob) {
            const age = this.calculateAge(new Date(data.dob));
            if (age < 14) {
                throw new AppError('Trialist must be at least 14 years old', 400);
            }
        }
        // Upload new files if provided
        const uploads = await this.uploadFiles(data.videoFile, data.cvFile);
        const updateData = {
            ...data,
            videoUrl: uploads.videoUrl || trialist.videoUrl,
            cvUrl: uploads.cvUrl || trialist.cvUrl,
        };
        // Remove undefined values
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        await this.repository.update(id, updateData);
        // Return updated trialist
        return await this.repository.findById(id);
    }
    async deleteTrialist(id) {
        const result = await this.repository.delete(id);
        if (result === 0) {
            throw new AppError('Trialist not found', 404);
        }
    }
    async updateTrialistStatus(id, status) {
        const trialist = await this.repository.findById(id);
        if (!trialist) {
            throw new AppError('Trialist not found', 404);
        }
        await this.repository.updateStatus(id, status);
        return await this.repository.findById(id);
    }
    async searchTrialists(keyword) {
        return await this.repository.searchByKeyword(keyword);
    }
    async getTrialistStatistics() {
        return await this.repository.getStatistics();
    }
    calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }
}
exports.TrialistService = TrialistService;
//# sourceMappingURL=TrialistService.js.map