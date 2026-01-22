import { Article } from '@models/Article';
import { ArticleAttributes } from '@models/Article';
import { BaseSeeder } from './base-seeder';
export declare class ArticleSeeder extends BaseSeeder<Article> {
    constructor();
    getData(environment: string): Promise<ArticleAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=article-seeder.d.ts.map