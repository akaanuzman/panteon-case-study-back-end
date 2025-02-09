import { Connection } from 'mysql2/promise';
import { faker } from '@faker-js/faker';
import { COUNTRY_CODES, TOTAL_COUNTRIES } from '../enums/players.countries';
import logger from '../helpers/logs/logger';
import Redis from 'ioredis';
import Player from '../models/player.model';
import { RedisKeys } from '../enums/redis.keys';

/**
 * SeederService
 * 
 * Handles database seeding operations for the game.
 * - Seeds 10M players with random data in 10k batches
 * - Syncs MySQL player data to Redis leaderboard
 * 
 * @method seedPlayers - Seeds MySQL with random player data
 * @method syncLeaderboardWithRedis - Syncs MySQL data to Redis sorted set
 * @returns {Object} Progress and performance metrics
 */
export class SeederService {
    private static BATCH_SIZE = 10000;
    private static TOTAL_PLAYERS = 10000000;
    private static usernameSet = new Set<string>();

    private static generateUniqueUsername(): string {
        let username: string;
        do {
            const firstName = faker.person.firstName();
            const gamertag = faker.internet.username();
            const number = faker.number.int({ min: 1, max: 9999 });

            username = `${firstName}_${gamertag}${number}`
                .replace(/[^a-zA-Z0-9_]/g, '')
                .toLowerCase()
                .substring(0, 30);

        } while (this.usernameSet.has(username));

        this.usernameSet.add(username);
        return username;
    }

    /**
     * Seeds the database with player data in batches
     * @param connection MySQL connection
     * @returns Progress information
     */
    public static async seedPlayers(connection: Connection) {
        let insertedCount = 0;
        const startTime = Date.now();

        try {
            // Create an array of all possible ranks
            const ranks = Array.from({ length: this.TOTAL_PLAYERS }, (_, i) => i + 1);

            // Shuffle the ranks array for random distribution
            for (let i = ranks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
            }

            // Insert players in batches of 10,000
            for (let i = 0; i < this.TOTAL_PLAYERS; i += this.BATCH_SIZE) {
                const batchRanks = ranks.slice(i, i + this.BATCH_SIZE);
                const values = Array.from({ length: this.BATCH_SIZE }, (_, index) => [
                    this.generateUniqueUsername(), // Unique username
                    COUNTRY_CODES[Math.floor(Math.random() * TOTAL_COUNTRIES)], // Random country code
                    faker.finance.amount({ min: 50, max: 10000, dec: 0 }), // Random money amount
                    batchRanks[index] // Assign rank from shuffled ranks array
                ]);

                const sql = `
                    INSERT INTO players (username, country, money, player_rank) 
                    VALUES ?
                `;

                await connection.query(sql, [values]);
                insertedCount += this.BATCH_SIZE;

                // Log progress every million records
                // with percentage, total records inserted, and records per second
                if (insertedCount % 1000000 === 0) {
                    const progress = (insertedCount / this.TOTAL_PLAYERS) * 100;
                    logger.info(`Progress: ${progress.toFixed(2)}% (${insertedCount} records)`);
                }
            }

            // Clear the Set after seeding is complete to free up memory
            this.usernameSet.clear();

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            return {
                success: true,
                insertedCount,
                duration: `${duration.toFixed(2)} seconds`,
                recordsPerSecond: (insertedCount / duration).toFixed(2)
            };
        } catch (error) {
            logger.error('Seeding error:', error);
            throw error;
        }
    }

    public static async syncLeaderboardWithRedis(connection: Connection) {
        let offset = 0;
        let totalSynced = 0;
        const startTime = Date.now();

        try {
            const redis = new Redis();
            logger.info('Starting leaderboard synchronization with Redis...');

            // Clear existing leaderboard
            await redis.del(RedisKeys.LEADERBOARD_KEY);

            while (true) {
                // Fetch 10k records at a time
                const [players]: any[] = await connection.query(`
                SELECT id, username, country, money, player_rank, created_at, updated_at 
                FROM players 
                ORDER BY player_rank 
                LIMIT ? OFFSET ?
            `, [this.BATCH_SIZE, offset]);

                if (players.length === 0) break;

                const pipeline = redis.pipeline();

                players.forEach((player: Player) => {
                    pipeline.zadd(
                        RedisKeys.LEADERBOARD_KEY,
                        player.player_rank,
                        JSON.stringify({
                            id: player.id,
                            username: player.username,
                            country: player.country,
                            money: player.money,
                            rank: player.player_rank,
                            created_at: player.created_at,
                            updated_at: player.updated_at
                        })
                    );
                });

                await pipeline.exec();

                totalSynced += players.length;
                offset += this.BATCH_SIZE;

                // Log progress every million records
                if (totalSynced % 1000000 === 0) {
                    const progress = (totalSynced / this.TOTAL_PLAYERS) * 100;
                    const timeElapsed = (Date.now() - startTime) / 1000;
                    const recordsPerSecond = (totalSynced / timeElapsed).toFixed(2);

                    logger.info(`Progress: ${progress.toFixed(2)} % (${totalSynced} records synced ${recordsPerSecond} records/sec)`);
                }
            }

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            logger.info('Leaderboard synchronization complete');

            return {
                success: true,
                message: 'Leaderboard synced successfully with Redis',
                totalSynced,
                duration: `${duration.toFixed(2)} seconds`,
                recordsPerSecond: (totalSynced / duration).toFixed(2)
            };

        } catch (error) {
            logger.error('Error syncing leaderboard to Redis:', error);
            throw error;
        }
    }
}