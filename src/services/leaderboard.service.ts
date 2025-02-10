import Redis from "ioredis";
import { RedisKeys } from "../enums/redis.keys";
import logger from "../helpers/logs/logger";

/**
 * LeaderboardService
 * 
 * Handles leaderboard operations using Redis for player rankings.
 * 
 * @class LeaderboardService
 * @methods
 * - getTopPlayers: Retrieves top 100 players from Redis
 * - searchPlayerRankingByUsername: Gets player's rank with surrounding players
 * - formatLeaderboard: Formats Redis data into structured response
 * 
 * @throws {Error} For Redis operations failures
 * @returns Formatted player data with rankings
 */
export class LeaderboardService {
    public static async getTopPlayers(redis: Redis) {
        try {
            const topPlayers = await redis.zrange(
                RedisKeys.LEADERBOARD_KEY,
                0,
                99,
                "WITHSCORES"
            );

            if (!topPlayers || topPlayers.length === 0) {
                throw new Error('No leaderboard data found in Redis');
            }

            return this.formatLeaderboard(topPlayers);
        } catch (error) {
            console.error('Redis Error:', error);
            throw error;
        }
    }

    public static async searchPlayerRankingByUsername(redis: Redis, username: string) {
        try {
            // Get first 100 players
            const topPlayers = await redis.zrange(
                RedisKeys.LEADERBOARD_KEY,
                0,
                99,
                "WITHSCORES"
            );

            // Find player by username using ZSCAN with cursor
            let cursor = '0';
            let playerKey = null;

            do {
                const result = await redis.zscan(
                    RedisKeys.LEADERBOARD_KEY,
                    cursor,
                    'MATCH',
                    `*"username":"${username}"*`,
                    'COUNT',
                    100
                );

                cursor = result[0];

                if (result[1].length > 0) {
                    playerKey = result[1][0];
                    break;
                }
            } while (cursor !== '0');

            if (!playerKey) {
                throw new Error('Player not found');
            }

            const playerRank = await redis.zrevrank(RedisKeys.LEADERBOARD_KEY, playerKey);

            if (playerRank === null) {
                throw new Error('Player rank not found');
            }

            // If player is in top 100, return only top players
            if (playerRank < 100) {
                return {
                    topPlayers: this.formatLeaderboard(topPlayers),
                    surroundingPlayers: null
                };
            }

            // Get surrounding players (3 above and 2 below)
            const surroundingPlayers = await redis.zrevrange(
                RedisKeys.LEADERBOARD_KEY,
                Math.max(0, playerRank - 2),  // 2 players below
                Math.min(playerRank + 3),     // 3 players above
                "WITHSCORES"
            );

            return {
                topPlayers: this.formatLeaderboard(topPlayers),
                surroundingPlayers: this.formatLeaderboard(surroundingPlayers)
            };

        } catch (error) {
            logger.error('Redis Error:', error);
            throw error;
        }
    }

    public static async getPrizePool(redis: Redis) {
        try {
            let totalMoney = await redis.get(RedisKeys.TOTAL_MONEY_KEY);

            if (!totalMoney) {
                totalMoney = '0';
                let cursor = '0';
                let runningTotal = BigInt(0);
                const CHUNK_SIZE = 1000;

                do {
                    const [nextCursor, chunk] = await redis.zscan(
                        RedisKeys.LEADERBOARD_KEY,
                        cursor,
                        'COUNT',
                        CHUNK_SIZE
                    );

                    cursor = nextCursor;

                    for (let i = 0; i < chunk.length; i += 2) {
                        const playerData = JSON.parse(chunk[i]);
                        runningTotal += BigInt(playerData.money);
                    }
                } while (cursor !== '0');

                totalMoney = runningTotal.toString();
                await redis.set(RedisKeys.TOTAL_MONEY_KEY, totalMoney, 'EX', 3600);
            }

            const totalMoneyBigInt = BigInt(totalMoney);
            const prizePool = totalMoneyBigInt * BigInt(2) / BigInt(100);

            return {
                totalMoney: totalMoney,
                prizePool: prizePool.toString(),
                prizePoolPercentage: 2,
                cachedAt: await redis.ttl(RedisKeys.TOTAL_MONEY_KEY)
            };
        } catch (error) {
            logger.error('Redis Error:', error);
            throw error;
        }
    }

    public static async resetWeeklyLeaderboard(redis: Redis) {
        try {
            // Get top 100 players before reset
            const topPlayers = await redis.zrange(
                RedisKeys.LEADERBOARD_KEY,
                0,
                99,
                'WITHSCORES'
            );

            if (!topPlayers || topPlayers.length === 0) {
                throw new Error('No players found in leaderboard');
            }

            // Get prize pool
            const prizePoolData = await this.getPrizePool(redis);
            const prizePool = BigInt(prizePoolData.prizePool);

            // Calculate prize distribution
            const prizeDistribution = new Map([
                [0, 20], // 1st place - 20%
                [1, 15], // 2nd place - 15%
                [2, 10], // 3rd place - 10%
            ]);

            // Remaining 55% distributed among positions 4-100
            const remainingPrize = BigInt(55);
            const remainingPlayers = BigInt(97); // 100 - 3
            const baseAmount = Number(remainingPrize) / Number(remainingPlayers);

            // Distribute prizes
            const rewards = [];
            for (let i = 0; i < topPlayers.length; i += 2) {
                const playerData = JSON.parse(topPlayers[i]);
                const rank = i / 2;
                let prizePercentage;

                if (prizeDistribution.has(rank)) {
                    prizePercentage = prizeDistribution.get(rank)!;
                } else {
                    prizePercentage = Math.floor(baseAmount);
                }

                const reward = (prizePool * BigInt(prizePercentage)) / BigInt(100);

                rewards.push({
                    playerId: playerData.id,
                    username: playerData.username,
                    rank: rank + 1,
                    prize: reward.toString()
                });
            }

            // Reset leaderboard scores
            await redis.del(RedisKeys.LEADERBOARD_KEY);
            await redis.del(RedisKeys.TOTAL_MONEY_KEY);

            logger.info('Weekly leaderboard reset successful');

            return {
                message: 'Weekly leaderboard reset successful',
                totalPrizePool: prizePool.toString(),
                rewards
            };
        } catch (error) {
            logger.error('Leaderboard Reset Error:', error);
            throw error;
        }
    }

    public static async getPlayerSuggestions(redis: Redis, query: string) {
        try {
            if (!query || query.length < 2) {
                return [];
            }

            const MAX_SUGGESTIONS = 4;
            const suggestions: any[] = [];
            let cursor = '0';

            do {
                const [nextCursor, results] = await redis.zscan(
                    RedisKeys.LEADERBOARD_KEY,
                    cursor,
                    'MATCH',
                    `*"username":"*${query}*"*`,
                    'COUNT',
                    100
                );

                cursor = nextCursor;

                for (let i = 0; i < results.length; i += 2) {
                    const playerData = JSON.parse(results[i]);
                    suggestions.push({
                        username: playerData.username,
                        country: playerData.country
                    });

                    if (suggestions.length >= MAX_SUGGESTIONS) {
                        return suggestions;
                    }
                }

            } while (cursor !== '0' && suggestions.length < MAX_SUGGESTIONS);

            return suggestions;
        } catch (error) {
            logger.error('Autocomplete Error:', error);
            throw error;
        }
    }

    private static formatLeaderboard(data: string[]) {
        try {
            const formatted = [];
            for (let i = 0; i < data.length; i += 2) {
                const playerData = JSON.parse(data[i]);
                formatted.push({
                    rank: playerData.rank,
                    player: {
                        id: playerData.id,
                        username: playerData.username,
                        country: playerData.country,
                        money: playerData.money,
                        created_at: playerData.created_at,
                        updated_at: playerData.updated_at
                    }
                });
            }
            return {
                total: formatted.length,
                players: formatted
            };
        } catch (error) {
            logger.error('Format Error:', error);
            throw new Error('Failed to format leaderboard data');
        }
    }
}