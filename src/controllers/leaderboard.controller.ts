import { Request, Response } from 'express';
import { LeaderboardService } from "../services/leaderboard.service";
import { RedisConfig } from '../config/redis.config';
import { StatusCodes } from '../enums/status.codes';
import logger from '../helpers/logs/logger';

/**
 * LeaderboardController
 * 
 * Handles HTTP requests for leaderboard operations.
 * 
 * @class LeaderboardController
 * @methods
 * - getTopPlayers: GET /api/leaderboard/top - Returns top 100 players
 * - searchPlayerRanking: GET /api/leaderboard/search?username - Finds player's rank and surrounding players
 * - getPrizePool: GET /api/leaderboard/prize-pool - Calculates prize pool
 * 
 * @throws {400} For invalid requests
 * @throws {404} When data not found
 * @throws {500} For server errors
 * 
 * @returns JSON responses with player rankings
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
            logger.error('Leaderboard Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Failed to fetch leaderboard",
                details: error.message
            });
        }
    }

    public static async searchPlayerRanking(req: Request, res: Response): Promise<Response> {
        try {
            const username = req.query.username as string;

            if (!username) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: "Username is required"
                });
            }

            const redis = RedisConfig.getInstance();
            const rankData = await LeaderboardService.searchPlayerRankingByUsername(redis, username);

            return res.json(rankData);
        } catch (error: any) {
            logger.error('Search Error:', error);
            return res.status(
                error.message === 'Player not found' ?
                    StatusCodes.NOT_FOUND :
                    StatusCodes.INTERNAL_SERVER_ERROR
            ).json({
                error: error.message || "Failed to search player ranking"
            });
        }
    }

    public static async getPrizePool(req: Request, res: Response): Promise<Response> {
        try {
            const redis = RedisConfig.getInstance();
            const prizePoolData = await LeaderboardService.getPrizePool(redis);

            return res.json(prizePoolData);
        } catch (error: any) {
            logger.error('Prize Pool Error:', error);
            return res.status(
                error.message === 'No leaderboard data found in Redis' ?
                    StatusCodes.NOT_FOUND :
                    StatusCodes.INTERNAL_SERVER_ERROR
            ).json({
                error: error.message || "Failed to calculate prize pool"
            });
        }
    }

    public static async resetWeeklyLeaderboard(req: Request, res: Response): Promise<Response> {
        try {
            const redis = RedisConfig.getInstance();
            const resetResult = await LeaderboardService.resetWeeklyLeaderboard(redis);

            return res.json(resetResult);
        } catch (error: any) {
            logger.error('Leaderboard Reset Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Failed to reset weekly leaderboard",
                details: error.message
            });
        }
    }

    public static async getAutocomplete(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query.q as string;

            if (!query) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: "Search query is required"
                });
            }

            const redis = RedisConfig.getInstance();
            const suggestions = await LeaderboardService.getPlayerSuggestions(redis, query);

            return res.json({
                query,
                suggestions
            });
        } catch (error: any) {
            logger.error('Autocomplete Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Failed to fetch suggestions",
                details: error.message
            });
        }
    }
}