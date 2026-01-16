// data/development/system-notification.ts
import { 
  SystemNotificationAttributes, 
  NotificationType, 
  NotificationSeverity 
} from "../../../models/SystemNotification";

// Admin User ID from User seeder
const ADMIN_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

export const developmentSystemNotifications: SystemNotificationAttributes[] = [
  {
    id: 'n1n1n1n1-n1n1-n1n1-n1n1-n1n1n1n1n1n1',
    type: NotificationType.SYSTEM,
    severity: NotificationSeverity.INFO,
    title: 'Welcome to the New Portal',
    message: 'Welcome back, Admin. The system has been updated with new analytics features.',
    data: { version: '2.0.0', module: 'dashboard' },
    read: false,
    userId: ADMIN_USER_ID,
    actionUrl: 'https://academy.com/admin/dashboard',
    expiresAt: undefined,
    metadata: { source: 'onboarding' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'n2n2n2n2-n2n2-n2n2-n2n2-n2n2n2n2n2n2',
    type: NotificationType.PAYMENT,
    severity: NotificationSeverity.WARNING,
    title: 'Subscription Renewal Due',
    message: 'The yearly sponsorship for "Global Tech Solutions" is due for renewal in 3 days.',
    data: { subscriptionId: '88888888-8888-8888-8888-888888888888' },
    read: false,
    userId: ADMIN_USER_ID, // Sending to admin to follow up
    actionUrl: 'https://academy.com/admin/subscriptions',
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)), // Expires in 7 days
    metadata: { priority: 'high' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'n3n3n3n3-n3n3-n3n3-n3n3-n3n3n3n3n3n3',
    type: NotificationType.SECURITY,
    severity: NotificationSeverity.CRITICAL,
    title: 'Scheduled Maintenance',
    message: 'The system will undergo maintenance on Sunday at 2:00 AM WAT.',
    data: { duration: '2 hours' },
    read: false,
    userId: undefined, // Global notification (no specific user)
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 2)),
    metadata: { broadcast: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];