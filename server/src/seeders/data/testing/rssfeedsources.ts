// data/development/rss-feed-source.ts
import { RssFeedSourceAttributes, RssFeedSourceCategory } from "../../../models/RssFeedSource";

export const testRssFeedSources: RssFeedSourceAttributes[] = [
  {
    id: '2f6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f61',
    name: 'Sportskeeda',
    feedUrl: 'https://api.sportskeeda.com/v3/feeds_v2/1414?limit=1000&response_type=w3c',
    category: RssFeedSourceCategory.SPORTS,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2f6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f62',
    name: 'Fox Sports',
    feedUrl: 'hhttps://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30',
    category: RssFeedSourceCategory.NIGERIA,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2f6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f63',
    name: 'Superwest Sports
',
    feedUrl: 'https://superwestsports.com/feed/',
    category: RssFeedSourceCategory.SPORTS,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];