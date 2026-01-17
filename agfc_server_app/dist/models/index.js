"use strict";
// models/associations.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.setupAssociations = void 0;
const database_1 = __importDefault(require("../config/database"));
// Base Entities
const User_1 = __importDefault(require("./User"));
const League_1 = __importDefault(require("./League"));
const Advertiser_1 = __importDefault(require("./Advertiser"));
const AdZones_1 = __importDefault(require("./AdZones"));
const RssFeedSource_1 = __importDefault(require("./RssFeedSource"));
const Video_1 = __importDefault(require("./Video")); // Added
const Trialist_1 = __importDefault(require("./Trialist")); // Added
// Content & Staff
const Article_1 = __importDefault(require("./Article"));
const ThirdPartyArticle_1 = __importDefault(require("./ThirdPartyArticle"));
const AcademyStaff_1 = __importDefault(require("./AcademyStaff"));
const Coach_1 = __importDefault(require("./Coach"));
// Match & Team
const Fixture_1 = __importDefault(require("./Fixture"));
const FixtureStatistics_1 = __importDefault(require("./FixtureStatistics")); // Added
const Goal_1 = __importDefault(require("./Goal"));
const Lineup_1 = __importDefault(require("./Lineup"));
const MatchImage_1 = __importDefault(require("./MatchImage"));
const LeagueStatistics_1 = __importDefault(require("./LeagueStatistics"));
const Player_1 = __importDefault(require("./Player"));
const PlayerLeagueStatistics_1 = __importDefault(require("./PlayerLeagueStatistics")); // Added
// Commercial & System
const Patron_1 = __importDefault(require("./Patron"));
const PatronSubscription_1 = __importDefault(require("./PatronSubscription"));
const Payment_1 = __importDefault(require("./Payment"));
const AdCampaign_1 = __importDefault(require("./AdCampaign"));
const AdCreative_1 = __importDefault(require("./AdCreative"));
const AuditLog_1 = __importDefault(require("./AuditLog"));
const SystemNotification_1 = __importDefault(require("./SystemNotification"));
async function setupAssociations() {
    // ==================== FIXTURE ASSOCIATIONS ====================
    Fixture_1.default.hasMany(Goal_1.default, {
        foreignKey: 'fixtureId',
        as: 'goals',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Goal_1.default.belongsTo(Fixture_1.default, {
        foreignKey: 'fixtureId',
        as: 'goalFixture',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Fixture_1.default.hasMany(Lineup_1.default, {
        foreignKey: 'fixtureId',
        as: 'lineups',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Lineup_1.default.belongsTo(Fixture_1.default, {
        foreignKey: 'fixtureId',
        as: 'fixture',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Fixture_1.default.hasMany(MatchImage_1.default, {
        foreignKey: 'fixtureId',
        as: 'images',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    MatchImage_1.default.belongsTo(Fixture_1.default, {
        foreignKey: 'fixtureId',
        as: 'imageFixture',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // NEW: Fixture Statistics (One-to-One)
    Fixture_1.default.hasOne(FixtureStatistics_1.default, {
        foreignKey: 'fixtureId',
        as: 'statistics',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    FixtureStatistics_1.default.belongsTo(Fixture_1.default, {
        foreignKey: 'fixtureId',
        as: 'fixture',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Fixture_1.default.belongsTo(League_1.default, {
        foreignKey: 'leagueId',
        as: 'league',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // Relation to Article (Match Report)
    Article_1.default.hasOne(Fixture_1.default, {
        foreignKey: 'matchReportArticleId',
        as: 'matchReportArticle',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Fixture_1.default.belongsTo(Article_1.default, {
        foreignKey: 'matchReportArticleId',
        as: 'matchReportArticle',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // ==================== LEAGUE ASSOCIATIONS ====================
    League_1.default.hasMany(Fixture_1.default, {
        foreignKey: 'leagueId',
        as: 'fixtures',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    League_1.default.hasMany(LeagueStatistics_1.default, {
        foreignKey: 'leagueId',
        as: 'teamStatistics',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    LeagueStatistics_1.default.belongsTo(League_1.default, {
        foreignKey: 'leagueId',
        as: 'league',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // NEW: Player League Statistics (via League)
    League_1.default.hasMany(PlayerLeagueStatistics_1.default, {
        foreignKey: 'leagueId',
        as: 'playerStatistics',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    PlayerLeagueStatistics_1.default.belongsTo(League_1.default, {
        foreignKey: 'leagueId',
        as: 'league',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // ==================== PLAYER ASSOCIATIONS ====================
    Player_1.default.hasMany(Lineup_1.default, {
        foreignKey: 'playerId',
        as: 'lineups',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Lineup_1.default.belongsTo(Player_1.default, {
        foreignKey: 'playerId',
        as: 'player',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Player_1.default.hasMany(Goal_1.default, {
        foreignKey: 'playerId',
        as: 'goalsScored',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Goal_1.default.belongsTo(Player_1.default, {
        foreignKey: 'playerId',
        as: 'goalScorer',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // NEW: Player League Statistics (via Player)
    Player_1.default.hasMany(PlayerLeagueStatistics_1.default, {
        foreignKey: 'playerId',
        as: 'leagueStatistics',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    PlayerLeagueStatistics_1.default.belongsTo(Player_1.default, {
        foreignKey: 'playerId',
        as: 'player',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // ==================== PATRON ASSOCIATIONS ====================
    Patron_1.default.hasOne(PatronSubscription_1.default, {
        foreignKey: 'patronId',
        as: 'subscription',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    PatronSubscription_1.default.belongsTo(Patron_1.default, {
        foreignKey: 'patronId',
        as: 'patron',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    PatronSubscription_1.default.hasMany(Payment_1.default, {
        foreignKey: 'subscriptionId',
        as: 'payments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Payment_1.default.belongsTo(PatronSubscription_1.default, {
        foreignKey: 'subscriptionId',
        as: 'subscription',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // ==================== ADVERTISING ASSOCIATIONS ====================
    Advertiser_1.default.hasMany(AdCampaign_1.default, {
        foreignKey: 'advertiserId',
        as: 'campaigns',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AdCampaign_1.default.belongsTo(Advertiser_1.default, {
        foreignKey: 'advertiserId',
        as: 'advertiser',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AdCampaign_1.default.hasMany(AdCreative_1.default, {
        foreignKey: 'campaignId',
        as: 'creatives',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AdCreative_1.default.belongsTo(AdCampaign_1.default, {
        foreignKey: 'campaignId',
        as: 'campaign',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AdCampaign_1.default.hasMany(Payment_1.default, {
        foreignKey: 'adCampaignId',
        as: 'payments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Payment_1.default.belongsTo(AdCampaign_1.default, {
        foreignKey: 'adCampaignId',
        as: 'adCampaign',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AdZones_1.default.hasMany(AdCreative_1.default, {
        foreignKey: 'zoneId',
        as: 'creatives',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AdCreative_1.default.belongsTo(AdZones_1.default, {
        foreignKey: 'zoneId',
        as: 'zone',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // ==================== USER ASSOCIATIONS ====================
    User_1.default.hasMany(Article_1.default, {
        foreignKey: 'authorId',
        as: 'articles',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Article_1.default.belongsTo(User_1.default, {
        foreignKey: 'authorId',
        as: 'author',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    User_1.default.hasMany(AuditLog_1.default, {
        foreignKey: 'userId',
        as: 'auditLogs',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AuditLog_1.default.belongsTo(User_1.default, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    User_1.default.hasMany(SystemNotification_1.default, {
        foreignKey: 'userId',
        as: 'notifications',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    SystemNotification_1.default.belongsTo(User_1.default, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // ==================== COACH & STAFF ASSOCIATIONS ====================
    Coach_1.default.belongsTo(User_1.default, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    User_1.default.hasOne(Coach_1.default, {
        foreignKey: 'userId',
        as: 'coachProfile',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    AcademyStaff_1.default.belongsTo(User_1.default, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    User_1.default.hasOne(AcademyStaff_1.default, {
        foreignKey: 'userId',
        as: 'academyStaffProfile',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    // ==================== CONTENT ASSOCIATIONS ====================
    RssFeedSource_1.default.hasMany(ThirdPartyArticle_1.default, {
        foreignKey: 'sourceId',
        as: 'articles',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    ThirdPartyArticle_1.default.belongsTo(RssFeedSource_1.default, {
        foreignKey: 'sourceId',
        as: 'source',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    console.log('✅ All associations configured');
}
exports.setupAssociations = setupAssociations;
const syncDatabase = async (force = false) => {
    try {
        await setupAssociations();
        await database_1.default.sync({ force });
        console.log('✅ Database synchronized successfully');
    }
    catch (error) {
        console.error('❌ Database synchronization failed:', error);
        // Debug logging for troubleshooting specific model issues
        console.log('Model Verification:');
        console.log('Video Loaded:', !!Video_1.default);
        console.log('Trialist Loaded:', !!Trialist_1.default);
        console.log('PlayerStats Loaded:', !!PlayerLeagueStatistics_1.default);
        throw error;
    }
};
exports.syncDatabase = syncDatabase;
//# sourceMappingURL=index.js.map