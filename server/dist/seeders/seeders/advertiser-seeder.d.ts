import Advertiser, { AdvertiserAttributes } from "@models/Advertiser";
import { BaseSeeder } from "./base-seeder";
export declare class AdvertiserSeeder extends BaseSeeder<Advertiser> {
    constructor();
    getData(environment: string): Promise<AdvertiserAttributes[]>;
    private getDevelopmentData;
}
//# sourceMappingURL=advertiser-seeder.d.ts.map