
import { Player } from '@models/Player';
import { PlayerAttributes } from '@models/Player';
import logger from '../../utils/logger';
import { developmentPlayers } from '../data/development/player';
import { productionPlayers } from '../data/production/players';
import { testPlayers } from '../data/testing/players';
import { BaseSeeder } from './base-seeder';

export class PlayerSeeder extends BaseSeeder<Player> {
  constructor() {
    super(Player, 'player');
  }

  async getData(environment: string): Promise<PlayerAttributes[]> {
    logger.info(`Loading ${this.name} data for ${environment} environment`);
    
    switch (environment) {
      case 'production':
        return await this.getProductionData();
      case 'test':
        return this.getTestData();
      case 'development':
      default:
        return this.getDevelopmentData();
    }
  }

  private async getProductionData(): Promise<PlayerAttributes[]> {
    try {
      return productionPlayers || [];
    } catch (error) {
      logger.warn(`No production data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getTestData(): PlayerAttributes[] {
    try {
      return testPlayers || [];
    } catch (error) {
      logger.warn(`No test data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  private getDevelopmentData(): PlayerAttributes[] {
    try {
      return developmentPlayers || [];
    } catch (error) {
      logger.warn(`No development data found for ${this.name}, returning empty array`);
      return [];
    }
  }

  async seed(options: any = {}): Promise<number> {
    return super.seed(options);
  }
}
