export declare function setupAssociations(): Promise<void>;
export interface FixtureAssociations {
    lineups: () => Promise<any[]>;
    goals: () => Promise<any[]>;
    images: () => Promise<any[]>;
    summary: () => Promise<any | null>;
    statistics: () => Promise<any | null>;
    league: () => Promise<any | null>;
}
export interface PlayerAssociations {
    lineups: () => Promise<any[]>;
    leagueStatistics: () => Promise<any[]>;
}
export interface LeagueAssociations {
    fixtures: () => Promise<any[]>;
    teamStatistics: () => Promise<any[]>;
    playerStatistics: () => Promise<any[]>;
}
export declare const syncDatabase: (force?: boolean) => Promise<void>;
//# sourceMappingURL=index.d.ts.map