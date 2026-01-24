import User from './User';
import League from './League';
import Advertiser from './Advertiser';
import AdZones from './AdZones';
import RssFeedSource from './RssFeedSource';
import Article from './Article';
import FeaturedNews from './FeaturedNews';
import AcademyStaff from './AcademyStaff';
import Coach from './Coach';
import Fixture from './Fixture';
import FixtureStatistics from './FixtureStatistics';
import Goal from './Goal';
import Lineup from './Lineup';
import FixtureImage from './FixtureImage';
import LeagueStatistics from './LeagueStatistics';
import Player from './Player';
import PlayerLeagueStatistics from './PlayerLeagueStatistics';
import Patron from './Patron';
import PatronSubscription from './PatronSubscription';
import Payment from './Payment';
import AdCampaign from './AdCampaign';
import AdCreative from './AdCreative';
import AuditLog from './AuditLog';
import SystemNotification from './SystemNotification';
import ScoutReport from './ScoutReport';
import ScoutApplication from './ScoutApplication';
import Video from './Video';
import Trialist from './Trialist';
export { User, League, Advertiser, AdZones, RssFeedSource, Video, Trialist, Article, FeaturedNews, AcademyStaff, Coach, Fixture, FixtureStatistics, Goal, Lineup, FixtureImage, LeagueStatistics, Player, PlayerLeagueStatistics, Patron, PatronSubscription, Payment, AdCampaign, AdCreative, AuditLog, SystemNotification, ScoutReport, ScoutApplication };
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