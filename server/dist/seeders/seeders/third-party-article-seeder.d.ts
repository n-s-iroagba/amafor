import FeaturedNews, { FeaturedNewsAttributes } from "@models/FeaturedNews";
import { BaseSeeder } from "./base-seeder";
export declare class FeaturedNewsSeeder extends BaseSeeder<FeaturedNews> {
    constructor();
    getData(environment: string): Promise<FeaturedNewsAttributes[]>;
    private getDevelopmentData;
}
//# sourceMappingURL=third-party-article-seeder.d.ts.map