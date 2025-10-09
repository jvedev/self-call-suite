export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private level: LogLevel = LogLevel.INFO;
  private maxLogs = 1000;

  setLevel(level: LogLevel) {
    this.level = level;
  }

  setMaxLogs(max: number) {
    this.maxLogs = max;
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    if (level < this.level) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context,
      error,
    };

    this.logs.push(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const levelName = LogLevel[level];
      const logMessage = `[${new Date(entry.timestamp).toISOString()}] ${levelName}: ${message}`;
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(logMessage, context);
          break;
        case LogLevel.INFO:
          console.info(logMessage, context);
          break;
        case LogLevel.WARN:
          console.warn(logMessage, context);
          break;
        case LogLevel.ERROR:
          console.error(logMessage, context, error);
          break;
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.addLog(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.addLog(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.addLog(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error) {
    this.addLog(LogLevel.ERROR, message, context, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();