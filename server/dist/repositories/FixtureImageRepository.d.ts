import { BaseRepository } from './BaseRepository';
import FixtureImage from '../models/FixtureImage';
export declare class FixtureImageRepository extends BaseRepository<FixtureImage> {
    constructor();
    findByFixture(fixtureId: string): Promise<FixtureImage[]>;
}
//# sourceMappingURL=FixtureImageRepository.d.ts.map