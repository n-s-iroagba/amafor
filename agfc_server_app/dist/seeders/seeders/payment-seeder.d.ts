import Payment, { PaymentAttributes } from "@models/Payment";
import { BaseSeeder } from "./base-seeder";
export declare class PaymentSeeder extends BaseSeeder<Payment> {
    constructor();
    getData(environment: string): Promise<PaymentAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=payment-seeder.d.ts.map