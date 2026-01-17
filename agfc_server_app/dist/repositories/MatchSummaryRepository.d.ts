import { BaseRepository } from './BaseRepository';
import MatchSummary from '../models/MatchSummary';
export declare class MatchSummaryRepository extends BaseRepository<MatchSummary> {
    constructor();
    findByFixture(fixtureId: string): Promise<MatchSummary | null>;
}
//# sourceMappingURL=MatchSummaryRepository.d.ts.map