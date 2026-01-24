"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentFeaturedNewss = void 0;
exports.developmentFeaturedNewss = [
    {
        id: 1,
        rssFeedSourceId: 1, // Fixturees 'Goal.com Nigeria' from RssFeedSource seeder
        originalId: 'https://www.goal.com/en-ng/news/super-eagles-qualify-afcon/12345abcde',
        title: 'Super Eagles secure AFCON ticket with game to spare',
        summary: 'Nigeria have booked their place in the next Africa Cup of Nations after a hard-fought draw in Sierra Leone.',
        content: '<p>Nigeria have booked their place in the next Africa Cup of Nations...</p>', // Feeds often replicate summary in content or have limited HTML
        publishedAt: new Date(new Date().setHours(new Date().getHours() - 5)), // 5 hours ago
        thumbnailUrl: 'https://placehold.co/300x200/000000/ffffff?text=Goal.com+News',
        created_at: new Date(),
    },
    {
        id: 2,
        rssFeedSourceId: 3, // Fixturees 'BBC Sport' from RssFeedSource seeder
        originalId: 'http://www.bbc.co.uk/sport/football/55555555',
        title: 'African Talent: The next generation of stars',
        summary: 'A look at the top 5 emerging talents from West African academies making waves in Europe.',
        content: null, // Some RSS feeds only provide a title/summary and no full content
        publishedAt: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
        thumbnailUrl: null, // Some feeds might not parse an image correctly
        created_at: new Date(),
    }
];
//# sourceMappingURL=thirdPartyArticles.js.map