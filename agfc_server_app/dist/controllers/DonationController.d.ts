export declare class DonationController {
    private donationService;
    constructor();
    initiateDonation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handleWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDonorWall: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listDonations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=DonationController.d.ts.map