// data/development/user.ts
import { UserAttributes, UserStatus } from "../../../models/User";

// Hash for 'password123'
const DEFAULT_PASSWORD_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4h.t/1.R..';
const passwordhash = '$2b$10$v7OLaRJDjIuuUwkiU1ZNaelm6cKbmEihRC.ribOU22i24Yo2r53Pa'; // hashed '12345678'

export const developmentUsers: UserAttributes[] = [
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    email: 'nnamdisolomon@gmail.com',
    passwordHash: passwordhash,
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+2348000000000',
    roles: ['admin'],
    status: UserStatus.ACTIVE,
    emailVerified: true,
    metadata: { access_level: 'root' },
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    email: 'scout@academy.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+2348011111111',
    roles: ['scout'],
    status: UserStatus.ACTIVE,
    emailVerified: true,
    metadata: {},
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    email: 'advertiser@academy.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    firstName: 'Sarah',
    lastName: 'Advertiser',
    phone: '+2348022222222',
    roles: ['advertiser'],
    status: UserStatus.ACTIVE,
    emailVerified: true,
    metadata: {},
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];