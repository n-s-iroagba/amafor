"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
// services/verification.service.ts
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
const TokenService_1 = require("./TokenService");
const EmailService_1 = __importDefault(require("./EmailService"));
const errors_1 = require("@utils/errors");
// Helper to generate verification codes
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
class VerificationService {
    constructor() {
        this.emailService = new EmailService_1.default('');
        this.tokenService = new TokenService_1.TokenService('aba', '');
        this.config = {
            jwtSecret: 'a',
            clientUrl: process.env.NODE_ENV === 'production' ? 'https://www.palmwebtv.com' : 'http://localhost:5000',
            tokenExpiration: {
                verification: 0,
                login: 0,
                refresh: 0
            }
        };
    }
    async initiateEmailVerificationProcess(user) {
        try {
            const verificationToken = this.tokenService.generateEmailVerificationToken(user);
            const verificationCode = process.env.NODE_ENV === 'production' ? generateVerificationCode() : '123456';
            console.log(verificationCode, verificationToken);
            // Store verification token (the User model uses verificationToken, not verificationCode)
            user.verificationToken = verificationToken;
            await user.save();
            await this.emailService.sendVerificationEmail(user);
            logger_1.default.info('Verification details generated successfully', { userId: user.id });
            return { verificationToken, id: user.id };
        }
        catch (error) {
            logger_1.default.error('Error generating verification details', { userId: user.id, error });
            throw error;
        }
    }
    async regenerateVerificationCode(token) {
        try {
            const user = await User_1.default.findOne({ where: { verificationToken: token } });
            if (!user) {
                throw new errors_1.BadRequestError('User not found with this verification token');
            }
            const verificationToken = this.tokenService.generateEmailVerificationToken(user);
            if (user.verificationToken !== token) {
                throw new errors_1.BadRequestError('Token does not match');
            }
            const verificationCode = process.env.NODE_ENV === 'production' ? generateVerificationCode() : '123456';
            console.log('VVVV', verificationCode);
            user.verificationToken = verificationToken;
            await user.save();
            await this.emailService.sendVerificationEmail(user);
            logger_1.default.info('Verification code regenerated', { userId: user.id });
            return verificationToken;
        }
        catch (error) {
            logger_1.default.error('Error regenerating verification code', { error });
            throw error;
        }
    }
    validateVerificationCode(user, token) {
        console.log(user);
        if (user.verificationToken !== token) {
            logger_1.default.warn('Invalid verification token provided', { userId: user.id });
            throw new errors_1.ForbiddenError('Invalid verification token', 'INVALID_VERIFICATION_TOKEN');
        }
        logger_1.default.info('Verification token validated successfully', { userId: user.id });
    }
}
exports.VerificationService = VerificationService;
//# sourceMappingURL=VerificationService.js.map