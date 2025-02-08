import { Request, Response } from 'express';
import { SeederService } from '../services/seeder.service';
import mysql from 'mysql2/promise';
import { MySQLConfigOptions } from '../config/mysql.config.options';

export class SeederController {
    public static async seedPlayers(req: Request, res: Response): Promise<void> {
        const connection = await mysql.createConnection(
            MySQLConfigOptions.getInstance().getOptions()
        );

        try {
            const result = await SeederService.seedPlayers(connection);
            res.json({
                status: 'success',
                message: 'Database seeded successfully',
                ...result
            });
        } catch (error: any) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to seed database',
                error: error.message
            });
        } finally {
            await connection.end();
        }
    }
}