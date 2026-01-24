"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentArticles = void 0;
// data/development/article.ts
const Article_1 = require("../../../models/Article");
// Admin User ID from User seeder
const AUTHOR_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
exports.developmentArticles = [
    // 1. A detailed Fixture Report (Simulating WYSIWYG output)
    {
        id: 'art1art1-art1-art1-art1-art1art1art1',
        title: 'Academy U17s Clinch Thrilling Victory Against City Strikers',
        // Simulating HTML content from a rich text editor
        content: `
      <h2>Fixture Overview</h2>
      <p>In a display of sheer determination, the <strong>Academy U17 team</strong> secured a vital 2-1 victory over City Strikers at the Main Arena yesterday.</p>
      
      <h3>First Half Dominance</h3>
      <p>The boys started strong, controlling possession early on. <em>Musa Ibrahim</em> broke the deadlock in the 15th minute with a spectacular volley.</p>
      <ul>
        <li>15' Goal: Musa Ibrahim (Assist: David Okafor)</li>
        <li>32' Yellow Card: City Striker #5</li>
      </ul>
      
      <h3>Late Drama</h3>
      <p>Despite conceding an equalizer just before the break, the team rallied. A penalty in the 88th minute sealed the deal.</p>
      <blockquote>"This is the spirit we want to see every week." - Coach Michael Johnson</blockquote>
    `,
        excerpt: 'A late penalty decided the fate of the intense derby match at the Main Arena yesterday.',
        featuredImage: 'https://placehold.co/800x400/1d3557/ffffff?text=Fixture+Report',
        tags: [Article_1.ArticleTag.MATCH_REPORT, Article_1.ArticleTag.FOOTBALL_NEWS],
        authorId: AUTHOR_ID,
        viewCount: 1250,
        readTime: 4,
        status: Article_1.ArticleStatus.PUBLISHED,
        publishedAt: new Date(new Date().setDate(new Date().getDate() - 1)), // Published yesterday
        adZones: ['mid_article', 'article_footer'],
        metadata: { seo_keywords: ['U17', 'Victory', 'Derby'] },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // 2. An Academy Update
    {
        id: 'art2art2-art2-art2-art2-art2art2art2',
        title: 'New Training Facility Construction Begins',
        content: `
      <p>We are excited to announce that ground has been broken on our new state-of-the-art gym facility.</p>
      <p><img src="https://placehold.co/600x300/e63946/ffffff?text=Construction+Site" alt="Construction Site" /></p>
      <p>The new wing will include:</p>
      <ol>
        <li>Hydrotherapy pools</li>
        <li>Advanced biomechanics lab</li>
        <li>Lecture theater for tactical analysis</li>
      </ol>
      <p>Completion is expected by <strong>Q4 2026</strong>.</p>
    `,
        excerpt: 'The Academy takes another step forward with the commencement of the new gym complex.',
        featuredImage: 'https://placehold.co/800x400/457b9d/ffffff?text=New+Facility',
        tags: [Article_1.ArticleTag.ACADEMY_UPDATE, Article_1.ArticleTag.CLUB_ANNOUNCEMENT],
        authorId: AUTHOR_ID,
        viewCount: 450,
        readTime: 2,
        status: Article_1.ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        adZones: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=articles.js.map