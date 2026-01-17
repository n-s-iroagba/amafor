"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redis = process.env.NODE_ENV === 'production' ? new ioredis_1.default('redis://default:VtJZwPmgkwiz9nio7ZovyMgpDx8Was4V@redis-14870.c293.eu-central-1-1.ec2.cloud.redislabs.com:14870') : new ioredis_1.default({
    host: 'localhost',
    port: 6379,
});
redis.on('connect', () => {
    console.log('✅ Connected to Redis');
});
redis.on('ready', () => {
    console.log('⚡ Redis is ready to accept commands');
});
redis.on('error', (err) => {
    console.error('❌ Redis error:', err);
});
redis.on('end', () => {
    console.warn('⚠️ Redis connection closed');
});
exports.default = redis;
//# sourceMappingURL=redisClient.js.map