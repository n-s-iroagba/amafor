"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = __importDefault(require("../utils/logger"));
const crpto_util_1 = require("../utils/crpto.util");
class PasswordService {
    constructor() {
        this.SALT_ROUNDS = 12;
    }
    async hashPassword(password) {
        if (!password) {
            logger_1.default.error('Password hashing attempted with empty password');
            throw new Error('Password is required');
        }
        try {
            const hashedPassword = await bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
            logger_1.default.info('Password hashed successfully');
            return hashedPassword;
        }
        catch (error) {
            logger_1.default.error('Password hashing failed', { error });
            throw new Error('Password hashing failed');
        }
    }
    async comparePasswords(plainPassword, hashedPassword) {
        if (!plainPassword || !hashedPassword) {
            logger_1.default.error('Password comparison attempted with missing parameters');
            throw new Error('Both passwords are required for comparison');
        }
        try {
            const isFixture = await bcryptjs_1.default.compare(plainPassword, hashedPassword);
            logger_1.default.info('Password comparison completed', { isFixture });
            return isFixture;
        }
        catch (error) {
            logger_1.default.error('Password comparison failed', { error });
            throw new Error('Password comparison failed');
        }
    }
    generateResetToken() {
        try {
            const tokens = crpto_util_1.CryptoUtil.generateSecureToken();
            logger_1.default.info('Password reset token generated successfully');
            return tokens;
        }
        catch (error) {
            logger_1.default.error('Reset token generation failed', { error });
            throw new Error('Reset token generation failed');
        }
    }
}
exports.PasswordService = PasswordService;
//# sourceMappingURL=PasswordService.js.map