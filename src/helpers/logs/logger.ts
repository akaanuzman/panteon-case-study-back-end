import winston from 'winston';
import path from 'path';
import { LogLevels, logLevelValues } from '../../enums/log.levels';

const logger = winston.createLogger({
    levels: logLevelValues,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // Error logs in a separate file
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: LogLevels.ERROR,
        }),
        // All logs in one file
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log'),
        }),
        // For development environment console will be used
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

export default logger;