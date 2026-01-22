"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentRssFeedSources = void 0;
// data/development/rss-feed-source.ts
const RssFeedSource_1 = require("../../../models/RssFeedSource");
exports.developmentRssFeedSources = [
    {
        id: 1,
        name: 'Goal.com Nigeria',
        feedUrl: 'https://www.goal.com/feeds/en-ng/news',
        category: RssFeedSource_1.RssFeedSourceCategory.SPORTS,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        name: 'Punch Newspapers - Sports',
        feedUrl: 'https://punchng.com/topics/sports/feed',
        category: RssFeedSource_1.RssFeedSourceCategory.NIGERIA,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        name: 'BBC Sport - Africa',
        feedUrl: 'http://feeds.bbci.co.uk/sport/football/african/rss.xml',
        category: RssFeedSource_1.RssFeedSourceCategory.SPORTS,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=rssfeedsources.js.map