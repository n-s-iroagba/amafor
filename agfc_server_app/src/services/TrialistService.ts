import { ITrialistRepository, TrialistRepository } from '@repositories/TrialistRepository';
import { TrialistAttributes, TrialistCreationAttributes } from '../models/Trialist';
import { AppError } from '@utils/errors';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTrialistData extends Omit<TrialistCreationAttributes, 'id' | 'videoUrl' | 'cvUrl'> {
  videoFile?: Express.Multer.File;
  cvFile?: Express.Multer.File;
}

export interface UpdateTrialistData extends Partial<Omit<TrialistAttributes, 'id' | 'videoUrl' | 'cvUrl'>> {
  videoFile?: Express.Multer.File;
  cvFile?: Express.Multer.File;
}

export class TrialistService {
  private repository: ITrialistRepository;

  constructor(repository?: ITrialistRepository) {
    this.repository = repository || new TrialistRepository();
  }

  async createTrialist(data: CreateTrialistData): Promise<TrialistAttributes> {
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

    // Upload files if provided
    const uploads = await this.uploadFiles(data.videoFile, data.cvFile);

    const trialistData: TrialistCreationAttributes = {
      ...data,
      id: uuidv4(),
      videoUrl: uploads.videoUrl,
      cvUrl: uploads.cvUrl,
      status: data.status || 'PENDING',
    };

    return await this.repository.create(trialistData);
  }

  async getTrialistById(id: string): Promise<TrialistAttributes> {
    const trialist = await this.repository.findById(id);
    if (!trialist) {
      throw new AppError('Trialist not found', 404);
    }
    return trialist;
  }

  async getAllTrialists(
    filters: {
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
  ): Promise<{ trialists: TrialistAttributes[]; total: number; page: number; totalPages: number }> {
    const { rows: trialists, count: total } = await this.repository.findAllFiltered(filters, options);

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

  async updateTrialist(id: string, data: UpdateTrialistData): Promise<TrialistAttributes> {
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

    const updateData: Partial<TrialistAttributes> = {
      ...data,
      videoUrl: uploads.videoUrl || trialist.videoUrl,
      cvUrl: uploads.cvUrl || trialist.cvUrl,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key =>
      updateData[key as keyof TrialistAttributes] === undefined && delete updateData[key as keyof TrialistAttributes]
    );

    await this.repository.update(id, updateData);

    // Return updated trialist
    return await this.repository.findById(id) as TrialistAttributes;
  }

  async deleteTrialist(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result === 0) {
      throw new AppError('Trialist not found', 404);
    }
  }

  async updateTrialistStatus(id: string, status: TrialistAttributes['status']): Promise<TrialistAttributes> {
    const trialist = await this.repository.findById(id);
    if (!trialist) {
      throw new AppError('Trialist not found', 404);
    }

    await this.repository.updateStatus(id, status);
    return await this.repository.findById(id) as TrialistAttributes;
  }

  async searchTrialists(keyword: string): Promise<TrialistAttributes[]> {
    return await this.repository.searchByKeyword(keyword);
  }

  async getTrialistStatistics(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    invited: number;
    rejected: number;
  }> {
    return await this.repository.getStatistics();
  }

  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  private async uploadFiles(
    videoFile?: Express.Multer.File,
    cvFile?: Express.Multer.File
  ): Promise<{ videoUrl?: string; cvUrl?: string }> {
    const result: { videoUrl?: string; cvUrl?: string } = {};

    // In a real implementation, you would upload to cloud storage
    // For now, we'll use local file paths or placeholder URLs
    if (videoFile) {
      result.videoUrl = `/uploads/trialists/videos/${videoFile.filename || videoFile.originalname}`;
    }

    if (cvFile) {
      result.cvUrl = `/uploads/trialists/cvs/${cvFile.filename || cvFile.originalname}`;
    }

    return result;
  }
}