import { DonationRepository } from '../repositories';
import { PaymentGateway } from '../utils/payment'; // Wrapper for Paystack/Stripe
import { structuredLogger, tracer } from '../utils';

export class DonationService {
  private donationRepository: DonationRepository;
  private paymentGateway: PaymentGateway;

  constructor() {
    this.donationRepository = new DonationRepository();
    this.paymentGateway = new PaymentGateway();
  }

  public async initiateDonation(amount: number, email: string, metadata: any): Promise<{ reference: string, url: string }> {
    return tracer.startActiveSpan('service.DonationService.initiateDonation', async (span) => {
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
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async processWebhook(event: any, signature: string): Promise<boolean> {
     // Validate signature logic here inside service or controller
     // Assuming event is valid:
     if (event.event === 'charge.success') {
       const reference = event.data.reference;
       await this.donationRepository.updateByReference(reference, { status: 'SUCCESS' });
       structuredLogger.business('DONATION_RECEIVED', 0, 'system', { amount: event.data.amount, reference });
       return true;
     }
     return false;
  }

  public async getDonorWall(limit: number): Promise<any[]> {
    return this.donationRepository.findTopDonors(limit);
  }

  public async listDonations(filters: any): Promise<any[]> {
    return this.donationRepository.findAll(filters);
  }
}