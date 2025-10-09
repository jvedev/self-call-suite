export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    data?: any;
}

export class Logger {
    private static instance: Logger;
    private logs: LogEntry[] = [];
    private logLevel: LogLevel = LogLevel.INFO;

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }

    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, data?: any): void {
        this.log(LogLevel.ERROR, message, data);
    }

    private log(level: LogLevel, message: string, data?: any): void {
        if (level >= this.logLevel) {
            const entry: LogEntry = {
                timestamp: new Date(),
                level,
                message,
                data
            };
            
            this.logs.push(entry);
            console.log(`[${LogLevel[level]}] ${message}`, data || '');
        }
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

export const logger = Logger.getInstance();