/**
 * Redis Key Constants
 * 
 * This enum contains all Redis key definitions used throughout the application.
 * Using an enum helps maintain consistency and avoid typos when accessing Redis keys.
 * 
 * @enum {string}
 * @property LEADERBOARD_KEY - The key for the leaderboard sorted set in Redis.
 * @property TOTAL_MONEY_KEY - The key for the total money value in Redis.
 */
export enum RedisKeys {
    LEADERBOARD_KEY = "leaderboard",
    TOTAL_MONEY_KEY = "total_money"
}