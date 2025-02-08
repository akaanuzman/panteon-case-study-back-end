import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redis = new Redis();

const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'middleware',
    points: 10,
    duration: 60,
});

export const rateLimiterMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await rateLimiter.consume(req.ip as string);
        next();
    } catch (err: any) {
        console.error(err);
        res.status(429).json({
            status: 'error',
            message: 'Too many requests',
            retryAfter: err.msBeforeNext / 1000
        });
    }
};