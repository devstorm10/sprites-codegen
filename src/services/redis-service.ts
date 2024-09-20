// src/services/redis-service.ts
import Redis from 'ioredis';

class RedisService {
    private static instance: Redis;

    private constructor() {}

    public static getInstance(): Redis {

        console.log("Redis Port:", process.env.REDIS_PORT);

        if (!RedisService.instance) {
            RedisService.instance = new Redis({
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD,
            });

            // Handle Redis connection errors
            RedisService.instance.on('error', (err) => {
                console.error('Redis error:', err);
            });
        }

        return RedisService.instance;
    }
}

export default RedisService;
