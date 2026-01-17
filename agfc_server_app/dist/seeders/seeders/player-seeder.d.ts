import { Player } from '@models/Player';
import { PlayerAttributes } from '@models/Player';
import { BaseSeeder } from './base-seeder';
export declare class PlayerSeeder extends BaseSeeder<Player> {
    constructor();
    getData(environment: string): Promise<PlayerAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=player-seeder.d.ts.map