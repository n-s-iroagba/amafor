import { BaseRepository } from './BaseRepository';
import MatchImage from '../models/MatchImage';
export declare class MatchImageRepository extends BaseRepository<MatchImage> {
    constructor();
    findByFixture(fixtureId: number): Promise<MatchImage[]>;
}
//# sourceMappingURL=MatchImageRepository.d.ts.map