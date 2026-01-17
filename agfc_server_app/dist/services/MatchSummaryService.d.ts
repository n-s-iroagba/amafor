import MatchSummary from '../models/MatchSummary';
export declare class MatchSummaryService {
    private matchSummaryRepository;
    private fixtureRepository;
    constructor();
    createMatchSummary(summaryData: Partial<MatchSummary>): Promise<MatchSummary>;
    getMatchSummaryById(id: number): Promise<MatchSummary>;
    getMatchSummaryByFixture(fixtureId: number): Promise<MatchSummary>;
    updateMatchSummary(id: number, summaryData: Partial<MatchSummary>): Promise<MatchSummary>;
    deleteMatchSummary(id: number): Promise<void>;
}
//# sourceMappingURL=MatchSummaryService.d.ts.map