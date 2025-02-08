import { PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MySQL Configuration Options Class
 * 
 * This class manages MySQL database connection configuration using the Singleton pattern.
 * It provides a centralized way to handle database connection options and ensures only
 * one instance of the configuration exists throughout the application lifecycle.
 * 
 * @class MySQLConfigOptions
 */
export class MySQLConfigOptions {
    /** Singleton instance of MySQLConfigOptions */
    private static instance: MySQLConfigOptions;

    /** MySQL connection pool options */
    private readonly options: PoolOptions;

    /**
     * Private constructor to prevent direct instantiation
     * Initializes MySQL connection pool options from environment variables
     * 
     * @private
     */
    private constructor() {
        this.options = {
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT ?? '') || 3306,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'leaderboard',
            waitForConnections: true,
            connectionLimit: 10, // Maximum number of connections in the pool
            queueLimit: 0, // Maximum number of connection requests the pool will queue
        };
    }

    /**
     * Gets the singleton instance of MySQLConfigOptions
     * Creates a new instance if one doesn't exist
     * 
     * @static
     * @returns {MySQLConfigOptions} The singleton instance
     */
    public static getInstance(): MySQLConfigOptions {
        if (!MySQLConfigOptions.instance) {
            MySQLConfigOptions.instance = new MySQLConfigOptions();
        }
        return MySQLConfigOptions.instance;
    }

    /**
     * Returns the MySQL connection pool options
     * 
     * @returns {PoolOptions} MySQL connection pool configuration
     */
    public getOptions(): PoolOptions {
        return this.options;
    }

    /**
     * Returns the configured database name
     * 
     * @returns {string} The name of the database
     */
    public getDatabaseName(): string {
        return this.options.database as string;
    }
}