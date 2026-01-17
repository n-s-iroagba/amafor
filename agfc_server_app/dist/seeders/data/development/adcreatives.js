"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentAdCreatives = void 0;
// Using predefined IDs from previous AdCampaign and AdZone steps
const CAMPAIGN_SUMMER_ID = 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa';
const CAMPAIGN_TECH_ID = 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb';
const ZONE_TOP_BANNER_ID = '10101010-1010-1010-1010-101010101010';
const ZONE_SIDEBAR_ID = '20202020-2020-2020-2020-202020202020';
exports.developmentAdCreatives = [
    {
        id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
        campaignId: CAMPAIGN_SUMMER_ID,
        zoneId: ZONE_TOP_BANNER_ID,
        name: 'Summer Sale Main Banner',
        url: 'https://placehold.co/728x90/ff9f1c/ffffff?text=Summer+Sale',
        destinationUrl: 'https://advertiser.com/summer-sale',
        type: 'image',
        format: 'jpg',
        dimensions: { width: 728, height: 90 },
        views: 2500,
        numberOfViews: 2500,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2',
        campaignId: CAMPAIGN_SUMMER_ID,
        zoneId: ZONE_SIDEBAR_ID,
        name: 'Summer Sale Sidebar',
        url: 'https://placehold.co/300x250/ff9f1c/ffffff?text=50%25+OFF',
        destinationUrl: 'https://advertiser.com/summer-sale',
        type: 'image',
        format: 'png',
        dimensions: { width: 300, height: 250 },
        views: 1500,
        numberOfViews: 1500,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
        campaignId: CAMPAIGN_TECH_ID,
        zoneId: ZONE_TOP_BANNER_ID,
        name: 'Tech Scholarship Video Teaser',
        url: 'https://placehold.co/728x90/2ec4b6/ffffff?text=Scholarship+Video',
        destinationUrl: 'https://tech-scholarship.ng/apply',
        type: 'video',
        format: 'mp4',
        dimensions: { width: 728, height: 90 },
        views: 0,
        numberOfViews: 0,
        created_at: new Date(),
        updated_at: new Date(),
    }
];
//# sourceMappingURL=adcreatives.js.map