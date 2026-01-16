// data/development/rss-feed-source.ts
import { RssFeedSourceAttributes, RssFeedSourceCategory } from "../../../models/RssFeedSource";

export const developmentRssFeedSources: RssFeedSourceAttributes[] = [
  {
    id: 1,
    name: 'Goal.com Nigeria',
    feedUrl: 'https://www.goal.com/feeds/en-ng/news',
    category: RssFeedSourceCategory.SPORTS,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Punch Newspapers - Sports',
    feedUrl: 'https://punchng.com/topics/sports/feed',
    category: RssFeedSourceCategory.NIGERIA,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'BBC Sport - Africa',
    feedUrl: 'http://feeds.bbci.co.uk/sport/football/african/rss.xml',
    category: RssFeedSourceCategory.SPORTS,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];