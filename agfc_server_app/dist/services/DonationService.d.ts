export declare class DonationService {
    private donationRepository;
    private paymentGateway;
    constructor();
    initiateDonation(amount: number, email: string, metadata: any): Promise<{
        reference: string;
        url: string;
    }>;
    processWebhook(event: any, signature: string): Promise<boolean>;
    getDonorWall(limit: number): Promise<any[]>;
    listDonations(filters: any): Promise<any[]>;
}
//# sourceMappingURL=DonationService.d.ts.map