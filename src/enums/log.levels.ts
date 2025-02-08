/**
 * Enum representing different logging levels in the application.
 * These levels are used to categorize log messages based on their severity and purpose.
 * @enum {string}
 */
export enum LogLevels {
    /** Critical errors that require immediate attention and may cause system failure */
    ERROR = 'error',
    /** Warning messages indicating potential issues or unexpected behavior */
    WARN = 'warn',
    /** General informational messages about system operation */
    INFO = 'info',
    /** HTTP request-specific logging for tracking API calls and responses */
    HTTP = 'http',
    /** Detailed debug information used during development and troubleshooting */
    DEBUG = 'debug'
}

/**
 * Object mapping log levels to their corresponding numeric values.
 * Lower values indicate higher severity.
 * This mapping is used by the Winston logger to determine message priority.
 * 
 * @const
 * @type {{ [key in LogLevels]: number }}
 * @property {number} ERROR - Level 0: Critical errors that need immediate attention
 * @property {number} WARN - Level 1: Warning messages for potentially harmful situations
 * @property {number} INFO - Level 2: General informational messages
 * @property {number} HTTP - Level 3: HTTP request-specific logs
 * @property {number} DEBUG - Level 4: Detailed debugging information
 * 
 * @example
 * // Using log levels in the logger
 * logger.log(LogLevels.ERROR, 'Database connection failed');
 * logger.log(LogLevels.INFO, 'Server started successfully');
 */
export const logLevelValues: { [key in LogLevels]: number; } = {
    [LogLevels.ERROR]: 0,
    [LogLevels.WARN]: 1,
    [LogLevels.INFO]: 2,
    [LogLevels.HTTP]: 3,
    [LogLevels.DEBUG]: 4,
};