import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL as string, {
  lazyConnect: true,
  connectTimeout: 5000,
  maxRetriesPerRequest: 1
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

export default redis;
