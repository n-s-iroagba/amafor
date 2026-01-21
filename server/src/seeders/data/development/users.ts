// data/development/user.ts
import { UserAttributes, UserStatus, UserType } from "../../../models/User";

// Hash for "password123"
const DEFAULT_PASSWORD_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4h.t/1.R..';

export const developmentUsers: UserAttributes[] = [
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    email: 'admin@academy.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+2348000000000',
    userType: UserType.SUPER_ADMIN,
    roles: ['admin', 'editor'],
    status: UserStatus.ACTIVE,
    emailVerified: true,
    metadata: { access_level: 'root' },
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    email: 'fan@academy.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+2348011111111',
    userType: UserType.FAN,
    roles: ['user'],
    status: UserStatus.ACTIVE,
    emailVerified: true,
    metadata: { favorite_team: 'U17' },
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    email: 'media@academy.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    firstName: 'Sarah',
    lastName: 'Media',
    phone: '+2348022222222',
    userType: UserType.MEDIA_MANAGER,
    roles: ['editor', 'publisher'],
    status: UserStatus.ACTIVE,
    emailVerified: true,
    metadata: {},
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];