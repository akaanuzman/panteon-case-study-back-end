import { Request, Response } from 'express';
import { SeederService } from '../services/seeder.service';
import mysql from 'mysql2/promise';
import { MySQLConfigOptions } from '../config/mysql.config.options';
import { StatusCodes } from '../enums/status.codes';

export class SeederController {
    public static async seedPlayers(req: Request, res: Response): Promise<void> {
        const connection = await mysql.createConnection(
            MySQLConfigOptions.getInstance().getOptions()
        );

        try {
            const result = await SeederService.seedPlayers(connection);
            const redisResult = await SeederService.syncLeaderboardWithRedis(connection);
            res.json({
                status: 'success',
                ...result,
                ...redisResult
            });
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to seed database',
                error: error.message
            });
        } finally {
            await connection.end();
        }
    }
}