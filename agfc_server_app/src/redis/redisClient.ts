import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = process.env.NODE_ENV === 'production' ? new Redis('redis://default:VtJZwPmgkwiz9nio7ZovyMgpDx8Was4V@redis-14870.c293.eu-central-1-1.ec2.cloud.redislabs.com:14870') : new Redis(
  {
    host: 'localhost',
    port: 6379,
  }
);


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
