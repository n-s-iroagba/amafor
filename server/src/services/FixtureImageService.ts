import { FixtureImageRepository } from '../repositories/FixtureImageRepository';
import { FixtureRepository } from '../repositories/FixtureRepository';
import { NotFoundError, DatabaseError, ValidationError } from '../utils/errors';
import FixtureImage, { FixtureImageCreationAttributes } from '../models/FixtureImage';
import Fixture from '../models/Fixture';

export class FixtureImageService {
  private fixtureImageRepository: FixtureImageRepository;
  private fixtureRepository: FixtureRepository;

  constructor() {
    this.fixtureImageRepository = new FixtureImageRepository();
    this.fixtureRepository = new FixtureRepository();
  }

  async createFixtureImage(imageData: FixtureImageCreationAttributes[]): Promise<FixtureImage[]> {


    try {
      return await FixtureImage.bulkCreate(imageData);
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getFixtureImageById(id: string): Promise<FixtureImage> {
    const image = await this.fixtureImageRepository.findById(id, {
      include: [
        {
          model: Fixture,
          as: 'fixture'
        }
      ]
    });
    if (!image) {
      throw new NotFoundError(`Fixture image with ID ${id} not found`);
    }
    return image;
  }

  async getFixtureImagesByFixture(fixtureId: string): Promise<FixtureImage[]> {
    try {
      console.log(await this.fixtureImageRepository.findAll())
      return await this.fixtureImageRepository.findByFixture(fixtureId);
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateFixtureImage(id: string, imageData: Partial<FixtureImage>): Promise<FixtureImage> {
    const image = await this.getFixtureImageById(id);

    try {
      const [count, updatedImages] = await this.fixtureImageRepository.update(id, imageData);
      if (count === 0) {
        throw new DatabaseError(`Failed to update match image with ID ${id}`);
      }
      return updatedImages[0] || image;
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deleteFixtureImage(id: string): Promise<void> {
    await this.getFixtureImageById(id); // Check if image exists

    try {
      const deleted = await this.fixtureImageRepository.delete(id);
      if (deleted === 0) {
        throw new DatabaseError(`Failed to delete match image with ID ${id}`);
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}