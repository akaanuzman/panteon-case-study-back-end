import mysql from 'mysql2/promise';
import { MySQLConfigOptions } from './mysql.config.options';

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
                money DECIMAL(20,2) DEFAULT 0,
                weekly_money DECIMAL(20,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_weekly_money (weekly_money),
                INDEX idx_country (country)
            )
        `);

        connection.release();
        console.log('Database and tables initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

export default initializeDatabase;