"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationService = void 0;
const repositories_1 = require("../repositories");
const payment_1 = require("../utils/payment"); // Wrapper for Paystack/Stripe
const utils_1 = require("../utils");
class DonationService {
    constructor() {
        this.donationRepository = new repositories_1.DonationRepository();
        this.paymentGateway = new payment_1.PaymentGateway();
    }
    async initiateDonation(amount, email, metadata) {
        return utils_1.tracer.startActiveSpan('service.DonationService.initiateDonation', async (span) => {
            try {
                // Create pending record
                const donation = await this.donationRepository.create({
                    amount,
                    email,
                    status: 'PENDING',
                    provider: 'paystack',
                    metadata
                });
                // Call Provider
                const { reference, authorization_url } = await this.paymentGateway.initializeTransaction(amount, email, donation.id);
                // Update record with reference
                await this.donationRepository.update(donation.id, { reference });
                return { reference, url: authorization_url };
            }
            catch (error) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        });
    }
    async processWebhook(event, signature) {
        // Validate signature logic here inside service or controller
        // Assuming event is valid:
        if (event.event === 'charge.success') {
            const reference = event.data.reference;
            await this.donationRepository.updateByReference(reference, { status: 'SUCCESS' });
            utils_1.structuredLogger.business('DONATION_RECEIVED', 0, 'system', { amount: event.data.amount, reference });
            return true;
        }
        return false;
    }
    async getDonorWall(limit) {
        return this.donationRepository.findTopDonors(limit);
    }
    async listDonations(filters) {
        return this.donationRepository.findAll(filters);
    }
}
exports.DonationService = DonationService;
//# sourceMappingURL=DonationService.js.map