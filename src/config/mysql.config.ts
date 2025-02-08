import mysql from 'mysql2/promise';
import { MySQLConfigOptions } from './mysql.config.options';
import logger from '../helpers/logs/logger';

const configOptions = MySQLConfigOptions.getInstance();
const pool = mysql.createPool(configOptions.getOptions());

const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        const dbName = configOptions.getDatabaseName();

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await connection.query(`USE ${dbName}`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS players (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(255) NOT NULL,
                country VARCHAR(2) NOT NULL,
                money INT(5) DEFAULT 0,
                player_rank INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_money (money),
                INDEX idx_player_rank (player_rank),
                INDEX idx_country (country)
            )
        `);

        connection.release();
        logger.info('Database and tables initialized successfully');
    } catch (error) {
        logger.error('Database initialization error:', error);
        throw error;
    }
};

export default initializeDatabase;