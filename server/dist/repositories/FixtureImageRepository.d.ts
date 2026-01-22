import { BaseRepository } from './BaseRepository';
import FixtureImage from '../models/FixtureImage';
export declare class FixtureImageRepository extends BaseRepository<FixtureImage> {
    constructor();
    findByFixture(fixtureId: number): Promise<FixtureImage[]>;
}
//# sourceMappingURL=FixtureImageRepository.d.ts.map