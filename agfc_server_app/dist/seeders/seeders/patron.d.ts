import Patron, { PatronAttributes } from "@models/Patron";
import { BaseSeeder } from "./base-seeder";
export declare class PatronSeeder extends BaseSeeder<Patron> {
    constructor();
    getData(environment: string): Promise<PatronAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=patron.d.ts.map