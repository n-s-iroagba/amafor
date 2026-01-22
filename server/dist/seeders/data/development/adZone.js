"use strict";
// data/development/ad-zone.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.adZonesData = void 0;
const AdZones_1 = require("../../../models/AdZones");
exports.adZonesData = [
    {
        id: 'TP_BAN',
        name: 'Top Page Banner',
        dimensions: '970x250',
        maxSize: '2MB',
        type: AdZones_1.AdZoneType.BANNER,
        description: 'Top of content pages across the site for maximum visibility',
        pricePerView: 500,
        status: AdZones_1.AdZoneStatus.ACTIVE,
        tags: ['general', 'sports'],
    },
    {
        id: 'SIDEBAR',
        name: 'Sidebar',
        dimensions: '300x250',
        maxSize: '1MB',
        type: AdZones_1.AdZoneType.SIDEBAR,
        description: 'Persistent sidebar placement on content pages for sustained exposure',
        pricePerView: 250,
        status: AdZones_1.AdZoneStatus.ACTIVE,
        tags: ['news', 'features'],
    },
    {
        id: 'ART_FOOT',
        name: 'Article Footer',
        dimensions: '728x90',
        maxSize: '1.5MB',
        type: AdZones_1.AdZoneType.FOOTER,
        description: 'Banner at the bottom of article pages after content',
        pricePerView: 150,
        status: AdZones_1.AdZoneStatus.ACTIVE,
        tags: ['editorial'],
    },
    {
        id: 'MID_ART',
        name: 'Mid-Article Banner',
        dimensions: '640x360',
        maxSize: '2MB',
        type: AdZones_1.AdZoneType.INLINE,
        description: 'Video ad embedded within article content after first 100 words',
        pricePerView: 400,
        status: AdZones_1.AdZoneStatus.ACTIVE,
        tags: ['video', 'engagement'],
    }
];
//# sourceMappingURL=adZone.js.map