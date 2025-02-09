import Redis from "ioredis";
import { RedisKeys } from "../enums/redis.keys";

/**
 * LeaderboardService
 * 
 * Handles leaderboard data operations using Redis.
 * 
 * @method getTopPlayers - Gets top 100 players from Redis sorted set
 * @method formatLeaderboard - Formats Redis data into structured player objects
 * @returns {Object} Formatted leaderboard with player details
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
            console.error('Format Error:', error);
            throw new Error('Failed to format leaderboard data');
        }
    }
}