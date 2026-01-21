import PatronSubscription from '@models/PatronSubscription';
import { PatronSubscriptionRepository, UserRepository } from '../repositories';

import { structuredLogger, tracer } from '../utils';

export class PatronageService {
  private patronRepo: PatronSubscriptionRepository;
  private userRepo: UserRepository;

  constructor() {
    this.patronRepo = new PatronSubscriptionRepository();
    this.userRepo = new UserRepository();
  }

  public async subscribeUser(userId: string, tier: 'GOLD' | 'SILVER' | 'BRONZE', amount: number): Promise<PatronSubscription> {
    return tracer.startActiveSpan('service.PatronageService.subscribeUser', async (span) => {
      try {
        // 1. Check if user exists
        const user = await this.userRepo.findById(userId);
        if (!user) throw new Error('User not found');

        // 2. Deactivate any existing active subscriptions
        await this.patronRepo.deactivateCurrent(userId);

        // 3. Create new subscription
        const subscription = await this.patronRepo.create({
          userId,
          tier,
          amount,
          status: 'ACTIVE',
          startDate: new Date(),
          nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });

        // 4. Update User Role/Badges if necessary
        await this.userRepo.update(userId, { isPatron: true, patronTier: tier });

        structuredLogger.business('PATRON_SUBSCRIBED', amount, userId, { tier });

        return subscription;
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async checkSubscriptionStatus(userId: string): Promise<{ isActive: boolean; tier?: string }> {
    return tracer.startActiveSpan('service.PatronageService.checkSubscriptionStatus', async (span) => {
      try {
        const sub = await this.patronRepo.findActiveByPatronId(userId);

        if (!sub) return { isActive: false };

        // Logic to check if expired
        const now = new Date();
        if (sub.nextBillingDate && sub.nextBillingDate < now) {
          // In a real system, we would trigger a renewal check here or mark as 'PAST_DUE'
          return { isActive: false, tier: sub.tier };
        }

        return { isActive: true, tier: sub.tier };
      } catch (error: any) {
        span.setStatus({ code: 2, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}