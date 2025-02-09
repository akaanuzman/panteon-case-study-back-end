import Redis from 'ioredis';

/**
 * RedisConfig
 * 
 * Singleton pattern implementation for Redis connection.
 * Provides a single shared Redis instance across the application.
 * 
 * @method getInstance - Returns Redis connection instance
 * @returns {Redis} Singleton Redis connection
 */
export class RedisConfig {
    private static instance: Redis;

    public static getInstance(): Redis {
        if (!RedisConfig.instance) {
            RedisConfig.instance = new Redis();
        }
        return RedisConfig.instance;
    }
}