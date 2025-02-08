import { Connection } from 'mysql2/promise';
import { faker } from '@faker-js/faker';
import { COUNTRY_CODES, TOTAL_COUNTRIES } from '../enums/players.countries';
import logger from '../helpers/logs/logger';

export class SeederService {
    private static BATCH_SIZE = 10000;
    private static TOTAL_PLAYERS = 10000000;

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
                    faker.internet.username(), // Random username
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
}