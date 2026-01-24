"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtil = void 0;
const crypto_1 = __importDefault(require("crypto"));
class CryptoUtil {
    static generateSecureToken() {
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        return { token, hashedToken };
    }
}
exports.CryptoUtil = CryptoUtil;
//# sourceMappingURL=crypto.util.js.map