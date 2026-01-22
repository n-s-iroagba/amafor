import FixtureSummary from '../models/FixtureSummary';
export declare class FixtureSummaryService {
    private repository;
    constructor();
    createFixtureSummary(data: any): Promise<FixtureSummary>;
    getFixtureSummaryById(id: number): Promise<FixtureSummary>;
    getFixtureSummaryByFixture(fixtureId: number): Promise<FixtureSummary | null>;
    updateFixtureSummary(id: number, data: any): Promise<FixtureSummary>;
    deleteFixtureSummary(id: number): Promise<void>;
}
//# sourceMappingURL=FixtureSummaryService.d.ts.map