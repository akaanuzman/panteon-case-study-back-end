import { Request, Response } from 'express';
import { LeaderboardService } from "../services/leaderboard.service";
import { RedisConfig } from '../config/redis.config';
import { StatusCodes } from '../enums/status.codes';

/**
 * LeaderboardController
 * 
 * Handles HTTP requests related to the game leaderboard.
 * Returns top 100 players sorted by rank.
 * 
 * @method getTopPlayers - Fetches top 100 players from Redis
 * @throws {404} If no leaderboard data found
 * @throws {500} If internal server error occurs
 * 
 * @example
 * GET /api/leaderboard/top
 * Returns: { total: number, players: Player[] }
 */
export class LeaderboardController {
    public static async getTopPlayers(req: Request, res: Response): Promise<Response> {
        try {
            const redis = RedisConfig.getInstance();
            const topPlayers = await LeaderboardService.getTopPlayers(redis);

            if (!topPlayers || !topPlayers.players.length) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "No leaderboard data found"
                });
            }

            return res.json(topPlayers);
        } catch (error: any) {
            console.error('Leaderboard Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Failed to fetch leaderboard",
                details: error.message
            });
        }
    }
}