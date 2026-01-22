"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const AuditService_1 = require("./AuditService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
class AuthService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
        this.auditService = new AuditService_1.AuditService();
    }
    async hashPassword(password) {
        const salt = await bcrypt_1.default.genSalt(10);
        return bcrypt_1.default.hash(password, salt);
    }
    async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    generateToken(payload) {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '7d' });
    }
    async register(data, ipAddress) {
        try {
            const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
            if (existingUser) {
                throw new Error('Email already registered');
            }
            const passwordHash = await this.hashPassword(data.passwordHash);
            const newUser = await this.userRepository.create({
                ...data,
                passwordHash,
                status: 'pending_verification',
                roles: ['user']
            });
            const token = this.generateToken({
                id: newUser.id,
                email: newUser.email,
                role: newUser.roles
            });
            // 1. Audit Log (DB + File)
            await this.auditService.logAction({
                userId: newUser.id,
                userEmail: newUser.email,
                userType: newUser.userType || 'user',
                action: 'CREATE',
                entityType: 'USER',
                entityId: newUser.id,
                entityName: newUser.email,
                changes: [],
                ipAddress,
                metadata: { event: 'registration' }
            });
            logger_1.default.info('User registered', { userId: newUser.id, email: newUser.email });
            return { user: newUser, token };
        }
        catch (error) {
            logger_1.default.error('Registration failed', { error: error.message, email: data.email });
            throw error;
        }
    }
    async login(email, password, ipAddress) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const isValid = await this.verifyPassword(password, user.passwordHash);
            if (!isValid) {
                logger_1.default.warn('Login failed - bad password', { userId: user.id, email });
                throw new Error('Invalid credentials');
            }
            if (user.status === 'suspended') {
                logger_1.default.warn('Login blocked - suspended', { userId: user.id, email });
                throw new Error('Account suspended');
            }
            const token = this.generateToken({
                id: user.id,
                email: user.email,
                role: user.roles
            });
            logger_1.default.info('Login success', { userId: user.id });
            await this.userRepository.update(user.id, { lastLogin: new Date() });
            return { user, token };
        }
        catch (error) {
            logger_1.default.error('Login failed', { error: error.message });
            throw error;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map