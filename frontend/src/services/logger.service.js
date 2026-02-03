/**
 * Logger Service
 * Centralized logging across the application
 */

const LOG_LEVELS = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

class LoggerService {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    /**
     * Format log message with timestamp and level
     */
    formatLog(level, context, message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] [${context}] ${message}`;
        return { logMessage, data };
    }

    /**
     * Log debug message (development only)
     */
    debug(context, message, data = null) {
        if (this.isDevelopment) {
            const { logMessage } = this.formatLog(LOG_LEVELS.DEBUG, context, message, data);
            console.debug(logMessage, data || '');
        }
    }

    /**
     * Log info message
     */
    info(context, message, data = null) {
        const { logMessage } = this.formatLog(LOG_LEVELS.INFO, context, message, data);
        console.log(logMessage, data || '');
    }

    /**
     * Log warning message
     */
    warn(context, message, data = null) {
        const { logMessage } = this.formatLog(LOG_LEVELS.WARN, context, message, data);
        console.warn(logMessage, data || '');
    }

    /**
     * Log error message
     */
    error(context, message, error = null) {
        const { logMessage } = this.formatLog(LOG_LEVELS.ERROR, context, message);
        console.error(logMessage, error || '');
        // In production, you might want to send this to an error tracking service
        this.reportError(context, message, error);
    }

    /**
     * Report error to external service (stub)
     */
    reportError(context, message, error) {
        // TODO: Implement error reporting to service like Sentry
        if (!this.isDevelopment) {
            // Send to error tracking service
        }
    }
}

export default new LoggerService();
