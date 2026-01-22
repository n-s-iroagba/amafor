"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentUsers = void 0;
// data/development/user.ts
const User_1 = require("../../../models/User");
// Hash for "password123"
const DEFAULT_PASSWORD_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4h.t/1.R..';
exports.developmentUsers = [
    {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        email: 'admin@academy.com',
        passwordHash: DEFAULT_PASSWORD_HASH,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+2348000000000',
        userType: User_1.UserType.SUPER_ADMIN,
        roles: ['admin', 'editor'],
        status: User_1.UserStatus.ACTIVE,
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
        userType: User_1.UserType.FAN,
        roles: ['user'],
        status: User_1.UserStatus.ACTIVE,
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
        userType: User_1.UserType.MEDIA_MANAGER,
        roles: ['editor', 'publisher'],
        status: User_1.UserStatus.ACTIVE,
        emailVerified: true,
        metadata: {},
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
//# sourceMappingURL=users.js.map