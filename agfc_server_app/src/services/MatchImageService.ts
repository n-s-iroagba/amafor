import { MatchImageRepository } from '../repositories/MatchImageRepository';
import { FixtureRepository } from '../repositories/FixtureRepository';
import { NotFoundError, DatabaseError, ValidationError } from '../utils/errors';
import  MatchImage, { MatchImageCreationAttributes }  from '../models/MatchImage';
import Fixture from '../models/Fixture';

export class MatchImageService {
  private matchImageRepository: MatchImageRepository;
  private fixtureRepository: FixtureRepository;

  constructor() {
    this.matchImageRepository = new MatchImageRepository();
    this.fixtureRepository = new FixtureRepository();
  }

  async createMatchImage(imageData: MatchImageCreationAttributes[]): Promise<MatchImage[]> {
 
console.log('llllllllllllll')
    try {
      return await MatchImage.bulkCreate(imageData);
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getMatchImageById(id: number): Promise<MatchImage> {
    const image = await this.matchImageRepository.findById(id,{
      include:[
        {
          model:Fixture,
          as:'fixture'
        }
      ]
    });
    if (!image) {
      throw new NotFoundError(`Match image with ID ${id} not found`);
    }
    return image;
  }

  async getMatchImagesByFixture(fixtureId: number): Promise<MatchImage[]> {
    try {
      console.log(await this.matchImageRepository.findAll())
      return await this.matchImageRepository.findByFixture(fixtureId);
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateMatchImage(id: number, imageData: Partial<MatchImage>): Promise<MatchImage> {
    const image = await this.getMatchImageById(id);
    
    try {
      const updatedImage = await this.matchImageRepository.updateById(id, imageData);
      if (!updatedImage) {
        throw new DatabaseError(`Failed to update match image with ID ${id}`);
      }
      return updatedImage;
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deleteMatchImage(id: number): Promise<void> {
    await this.getMatchImageById(id); // Check if image exists
    
    try {
      const deleted = await this.matchImageRepository.deleteById(id);
      if (!deleted) {
        throw new DatabaseError(`Failed to delete match image with ID ${id}`);
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}