import League from '../models/League';
export declare class LeagueService {
    private leagueRepository;
    private fixtureRepository;
    constructor();
    getAllLeagues(): Promise<League[]>;
    getLeagueById(id: string): Promise<League | null>;
    createLeague(data: any): Promise<League>;
    updateLeague(id: string, data: any): Promise<League | null>;
    deleteLeague(id: string): Promise<boolean>;
    getLeagueWithTable(leagueId: string): Promise<any>;
    getLeaguesWithTables(): Promise<any[]>;
    private calculateTable;
    private initTeamStats;
}
//# sourceMappingURL=LeagueService.d.ts.map