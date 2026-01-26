
import { PatronSubscriptionPackage, PatronSubscriptionPackageAttributes } from '../../models/PatronSubscriptionPackage';
import logger from "../../utils/logger";
import { developmentPatronSubscriptionPackages } from '../data/development/patronsubscriptionpackages';
import { BaseSeeder } from './base-seeder';

export class PatronSubscriptionPackageSeeder extends BaseSeeder<PatronSubscriptionPackage> {
    constructor() {
        super(PatronSubscriptionPackage, 'patronsubscriptionpackage');
    }

    async getData(environment: string): Promise<PatronSubscriptionPackageAttributes[]> {
        logger.info(`Loading ${this.name} data for ${environment} environment`);

        switch (environment) {
            case 'development':
            default:
                // For now, we only have development data, but we can add logic for other envs later
                // reusing development data as a fallback to avoid empty db if needed, or return []
                return this.getDevelopmentData();
        }
    }

    private getDevelopmentData(): PatronSubscriptionPackageAttributes[] {
        try {
            return developmentPatronSubscriptionPackages || [];
        } catch (error) {
            logger.warn(`No development data found for ${this.name}, returning empty array`);
            return [];
        }
    }
}
