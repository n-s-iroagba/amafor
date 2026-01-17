import AcademyStaff, { AcademyStaffAttributes } from "@models/AcademyStaff";
import { BaseSeeder } from "./base-seeder";
export declare class AcademyStaffSeeder extends BaseSeeder<AcademyStaff> {
    constructor();
    getData(environment: string): Promise<AcademyStaffAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=academy-staff-seeder.d.ts.map