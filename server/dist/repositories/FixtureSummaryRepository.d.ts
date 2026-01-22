import { BaseRepository } from './BaseRepository';
import FixtureSummary from '../models/FixtureSummary';
export declare class FixtureSummaryRepository extends BaseRepository<FixtureSummary> {
    constructor();
    findByFixture(fixtureId: string): Promise<FixtureSummary | null>;
}
//# sourceMappingURL=FixtureSummaryRepository.d.ts.map