
import { v4 as uuidv4 } from 'uuid';
import { PatronTier, SubscriptionFrequency } from '../../../models/PatronSubscriptionPackage';

export const developmentPatronSubscriptionPackages = [
    // SPONSOR GRAND PATRON - Monthly
    {
        id: uuidv4(),
        tier: PatronTier.SPONSOR_GRAND_PATRON,
        frequency: SubscriptionFrequency.MONTHLY,
        miniumumAmount: 100000,
        benefits: [
            "Exclusive access to VIP events",
            "Signed jersey by the team captain",
            "Name on the official website sponsor wall",
            "Two free tickets to all home games",
            "Monthly newsletter with insider updates"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // SPONSOR GRAND PATRON - Yearly
    {
        id: uuidv4(),
        tier: PatronTier.SPONSOR_GRAND_PATRON,
        frequency: SubscriptionFrequency.YEARLY,
        miniumumAmount: 1000000, // 2 months discount equivalent
        benefits: [
            "All monthly benefits",
            "Private dinner with the team management",
            "Framed team photo with autograph",
            "Dedicated parking spot at the stadium"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // PATRON - Monthly
    {
        id: uuidv4(),
        tier: PatronTier.PATRON,
        frequency: SubscriptionFrequency.MONTHLY,
        miniumumAmount: 50000,
        benefits: [
            "Name on the supporter wall",
            "One free ticket to 5 home games",
            "Access to member-only forum",
            "Discount on merchandise (10%)"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // PATRON - Yearly
    {
        id: uuidv4(),
        tier: PatronTier.PATRON,
        frequency: SubscriptionFrequency.YEARLY,
        miniumumAmount: 500000,
        benefits: [
            "All monthly benefits",
            "Exclusive access to pre-season training",
            "Official supporter scarf"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // SUPPORTER - Monthly
    {
        id: uuidv4(),
        tier: PatronTier.SUPPORTER,
        frequency: SubscriptionFrequency.MONTHLY,
        miniumumAmount: 10000,
        benefits: [
            "Name on the website supporter list",
            "Monthly newsletter",
            "Priority purchase for match tickets"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // SUPPORTER - Yearly
    {
        id: uuidv4(),
        tier: PatronTier.SUPPORTER,
        frequency: SubscriptionFrequency.YEARLY,
        miniumumAmount: 100000,
        benefits: [
            "All monthly benefits",
            "Team sticker pack",
            "5% discount on merchandise"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
