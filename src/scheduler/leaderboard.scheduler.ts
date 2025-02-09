import cron from 'node-cron';
import { LeaderboardService } from '../services/leaderboard.service';
import { RedisConfig } from '../config/redis.config';
import logger from '../helpers/logs/logger';
import { SeederService } from '../services/seeder.service';
import { MySQLConfigOptions } from '../config/mysql.config.options';
import mysql from 'mysql2/promise';

export class LeaderboardScheduler {
    public static initScheduledJobs() {
        const options = {
            scheduled: true,
            timezone: "Europe/Istanbul"
        };

        cron.schedule('0 0 * * 1', async () => {
            try {
                const redis = RedisConfig.getInstance();
                const response = await LeaderboardService.resetWeeklyLeaderboard(redis);
                const date = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
                logger.info('Weekly leaderboard reset completed at: ' + date);
                logger.debug('Leaderboard reset response:', response);
            } catch (error) {
                logger.error('Scheduled leaderboard reset failed:', error);
            }
        }, options);
    }
}