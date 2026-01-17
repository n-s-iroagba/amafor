import ThirdPartyArticle, { ThirdPartyArticleAttributes } from "@models/ThirdPartyArticle";
import { BaseSeeder } from "./base-seeder";
export declare class ThirdPartyArticleSeeder extends BaseSeeder<ThirdPartyArticle> {
    constructor();
    getData(environment: string): Promise<ThirdPartyArticleAttributes[]>;
    private getDevelopmentData;
}
//# sourceMappingURL=third-party-article-seeder.d.ts.map