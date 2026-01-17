"use strict";
// src/services/AuthService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_types_1 = require("../types/auth.types");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
const EmailService_1 = __importDefault(require("./EmailService"));
const PasswordService_1 = require("./PasswordService");
const TokenService_1 = __importDefault(require("./TokenService"));
const user_service_1 = require("./user.service");
const VerificationService_1 = require("./VerificationService");
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const User_1 = __importDefault(require("../models/User"));
const AdvertiserService_1 = require("./AdvertiserService");
class AuthService {
    constructor() {
        this.passwordService = new PasswordService_1.PasswordService();
        this.verificationService = new VerificationService_1.VerificationService();
        this.tokenService = TokenService_1.default;
        this.userService = new user_service_1.UserService();
        this.emailService = new EmailService_1.default('');
        this.userRepository = new UserRepository_1.default();
    }
    /**
     * Registers a new user and initiates email verification.
     */
    async signupAdvertiser(data) {
        const { username, email, password, confirmPassword, companyName, contactName, contact_email, contact_phone, } = data;
        const userData = { username, email, password, confirmPassword };
        const advertiser = { companyName, contactName, contact_email, contact_phone };
        try {
            logger_1.default.info('Sign up process started', { email: data.email });
            const hashedPassword = await this.passwordService.hashPassword(data.password);
            const existingUser = await this.userRepository.findUserByEmail(data.email);
            if (existingUser) {
                throw new errors_1.ConflictError('User with this email already exists .');
            }
            const user = await this.userRepository.createUser({
                ...userData,
                password: hashedPassword,
                role: auth_types_1.Role.ADVERTISER,
            });
            new AdvertiserService_1.AdvertiserService().create({ userId: user.id, ...advertiser });
            const response = await this.verificationService.intiateEmailVerificationProcess(user);
            logger_1.default.info('Sign up completed successfully', { userId: user.id });
            return response;
        }
        catch (error) {
            return this.handleAuthError('Sign up', { email: data.email }, error);
        }
    }
    /**
     * Creates a sports admin.
     */
    async createSportsAdmin(data) {
        try {
            logger_1.default.info('Admin sign up started', { email: data.email });
            const hashedPassword = await this.passwordService.hashPassword(data.password);
            const user = await this.userRepository.createUser({
                ...data,
                password: hashedPassword,
                role: auth_types_1.Role.SPORTS_ADMIN,
                isEmailVerified: false
            });
            await this.verificationService.intiateEmailVerificationProcess(user);
            logger_1.default.info('Sign up completed successfully', { userId: user.id });
            return user;
        }
        catch (error) {
            return this.handleAuthError('Admin sign up', { email: data.email }, error);
        }
    }
    async createAdmin(data) {
        try {
            logger_1.default.info('Admin sign up started', { email: data.email });
            const hashedPassword = await this.passwordService.hashPassword(data.password);
            const user = await this.userRepository.createUser({
                username: data.username,
                password: hashedPassword,
                role: auth_types_1.Role.ADMIN,
                isEmailVerified: false,
                email: data.email
            });
            const response = await this.verificationService.intiateEmailVerificationProcess(user);
            logger_1.default.info('Sign up completed successfully', { userId: user.id });
            return response;
        }
        catch (error) {
            return this.handleAuthError('Admin sign up', { email: data.email }, error);
        }
    }
    /**
     * Logs a user in by validating credentials and returning tokens.
     */
    async login(data) {
        try {
            logger_1.default.info('Login attempt started', { email: data.email });
            const user = await this.userService.findUserByEmail(data.email, true);
            if (!user) {
                throw new errors_1.NotFoundError('user not found');
            }
            await this.validatePassword(user, data.password);
            if (!user.isEmailVerified) {
                logger_1.default.warn('Login attempted by unverified user', { userId: user.id });
                return await this.verificationService.intiateEmailVerificationProcess(user);
            }
            const { accessToken, refreshToken } = this.generateTokenPair(user);
            logger_1.default.info('Login successful', { userId: user.id });
            const returnUser = { ...user.get({ plain: true }) };
            user.refreshToken = refreshToken;
            await user.save();
            return { user: returnUser, accessToken, refreshToken };
        }
        catch (error) {
            return this.handleAuthError('Login', { email: data.email }, error);
        }
    }
    /**
     * Issues a new access token from a refresh token.
     */
    async refreshToken(refreshToken) {
        try {
            logger_1.default.info('Token refresh attempted');
            const { decoded } = this.tokenService.verifyToken(refreshToken, 'refresh');
            const adminId = decoded.id;
            if (!adminId) {
                logger_1.default.warn('Invalid refresh token provided');
                throw new errors_1.BadRequestError('Invalid refresh token');
            }
            const user = await this.userService.findUserById(adminId);
            const newAccessToken = this.tokenService.generateAccessToken(user);
            logger_1.default.info('Token refreshed successfully', { userId: user.id });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            return this.handleAuthError('Token refresh', {}, error);
        }
    }
    /**
     * Verifies a user's email using a token and code.
     */
    async verifyEmail(data) {
        try {
            logger_1.default.info('Email verification started');
            // const { decoded } = this.tokenService.verifyToken(data.verificationToken, 'email_verification')
            // console.log(decoded)
            // const userId = decoded?.AdminId ?? decoded?.userId
            const user = await User_1.default.findOne({ where: { verificationToken: data.verificationToken } });
            if (!user) {
                logger_1.default.warn('Invalid verification token provided');
                throw new errors_1.BadRequestError('Unsuitable token');
            }
            this.verificationService.validateVerificationCode(user, data.verificationCode);
            await this.userService.markUserAsVerified(user);
            const { accessToken, refreshToken } = this.generateTokenPair(user);
            logger_1.default.info('Email verification successful', { userId: user.id });
            const returnUser = { ...user.get({ plain: true }) };
            user.refreshToken = refreshToken;
            await user.save();
            return { user: returnUser, accessToken, refreshToken };
        }
        catch (error) {
            return this.handleAuthError('Email verification', {}, error);
        }
    }
    /**
     * Generates a new email verification code.
     */
    async generateNewCode(token) {
        try {
            logger_1.default.info('New verification code generation requested');
            return await this.verificationService.regenerateVerificationCode(token);
        }
        catch (error) {
            return this.handleAuthError('New code generation', {}, error);
        }
    }
    /**
     * Sends a password reset email to the user.
     */
    async forgotPassword(email) {
        try {
            logger_1.default.info('Password reset requested', { email });
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                logger_1.default.error('Password reset requested for non-existent email', { email });
                throw new errors_1.NotFoundError('user for forgot password not found');
            }
            const { token, hashedToken } = this.passwordService.generateResetToken();
            await this.userService.setPasswordResetDetails(user, hashedToken);
            await this.emailService.sendPasswordResetEmail(user.email, token);
            logger_1.default.info('Password reset email sent', { userId: user.id });
        }
        catch (error) {
            return this.handleAuthError('Password reset', { email }, error);
        }
    }
    /**
     * Resets the user's password using the reset token.
     */
    async resetPassword(data) {
        try {
            logger_1.default.info('Password reset process started');
            const user = await this.userService.findUserByResetToken(data.resetPasswordToken);
            const hashedPassword = await this.passwordService.hashPassword(data.password);
            await this.userService.updateUserPassword(user, hashedPassword);
            const { accessToken, refreshToken } = this.generateTokenPair(user);
            logger_1.default.info('Password reset successful', { userId: user.id });
            return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken);
        }
        catch (error) {
            return this.handleAuthError('Password reset', {}, error);
        }
    }
    /**
     * Retrieves a user by ID.
     */
    async getUserById(userId) {
        try {
            logger_1.default.info('Get user by ID requested', { userId });
            const user = await this.userService.findUserById(userId);
            logger_1.default.info('User retrieved successfully', { userId: user.id });
            return user;
        }
        catch (error) {
            return this.handleAuthError('Get user by ID', { userId }, error);
        }
    }
    /**
     * Returns the current authenticated user's details.
     */
    async getMe(userId) {
        try {
            logger_1.default.info('Get current user requested', { userId });
            const user = await this.userService.findUserById(userId);
            logger_1.default.info('Current user retrieved successfully', { userId });
            return user;
        }
        catch (error) {
            return this.handleAuthError('Get current user', { userId }, error);
        }
    }
    // ----------------- helpers -----------------
    async validatePassword(user, password) {
        const isMatch = await this.passwordService.comparePasswords(password, user.password);
        if (!isMatch) {
            logger_1.default.warn('Password validation failed', { userId: user.id });
            throw new errors_1.BadRequestError('Invalid credentials', 'INVALID_CREDENTIALS');
        }
        logger_1.default.info('Password validated successfully', { userId: user.id });
    }
    generateTokenPair(user) {
        const accessToken = this.tokenService.generateAccessToken(user);
        const refreshToken = this.tokenService.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }
    async saveRefreshTokenAndReturn(passedUser, accessToken, refreshToken) {
        passedUser.refreshToken = refreshToken;
        await passedUser.save();
        const user = { ...passedUser.get ? passedUser.get({ plain: true }) : passedUser };
        return { accessToken, user, refreshToken };
    }
    async handleAuthError(operation, context, error) {
        logger_1.default.error(`${operation} failed`, { ...context, error });
        throw error;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map