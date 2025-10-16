import { Logger } from "../utils/logger";

/**
 * LogService class to handle logging with different levels and outputs
 * Supports console logging and file logging
 * Log levels: debug, info, warn, error, transaction
 * Example usage:
 *  import log from '../services/logService';
 *   log.info("This is an info message", { additional: "data" });
 *   log.warn("This is a warning message");
 *   log.error("This is an error message", new Error("Something went wrong"));
 *   log.transaction("User purchased item", { itemId: 123, amount: 49.99 });
 */
interface IFileLogger {
  debug?(message: string, data?: any): void;
  trace?(message: string, data?: any): void;
  fatal?(message: string, data?: any): void;
  info?(message: string, data?: any): void;
  warn?(message: string, data?: any): void;
  error?(message: string, data?: any): void;
  transaction?(message: string, data?: any): void;
}

class LogService {
  isProduction: boolean;
  logLevel: string;
  enableConsole: boolean;
  // enableApiLogging: boolean;
  levels: { [key: string]: number };
  fileLogger: IFileLogger; // Add file logger instance

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.logLevel = process.env.LOG_LEVEL || "info";
    this.enableConsole = process.env.CONSOLE_LOGS !== "false";
    // this.enableApiLogging = process.env.API_LOGGING !== "false";
    try {
      this.fileLogger = new Logger();
    } catch (error) {
      console.warn('Failed to initialize file logger:', error);
      this.fileLogger = {}; // Fallback to empty object
    }

    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      transaction: 4,
      trace: 5,
      fatal: 6
    };
  }

  /**
   * Determine if a log level should be displayed
   */
  shouldLog(level: keyof typeof this.levels) {
    if (!this.levels.hasOwnProperty(level)) return false;
    // Fix: Current log level should be <= target level (lower numbers = higher priority)
    return this.levels[level] >= this.levels[this.logLevel] || 0;
  }

  /**
   * Format timestamp for logs
   */
  getTimestamp() {
    // Simpler and more reliable approach
    const now = new Date();
    const dateTimeNow = new Intl.DateTimeFormat('sv-SE', {
      timeZone: process.env.LOG_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(now).replace(' ', 'T');
    
    return dateTimeNow;
  }

  /**
   * Main logging method that handles both console and file logging
   */
  log(level: keyof typeof this.levels, message: string, data: any = null) {
    if (!this.shouldLog(level)) return;

    const timestamp = this.getTimestamp();

    // File logging - always log to file
    switch (level) {
      case "debug":
        this.fileLogger.debug?.(message, data) || console.debug(`[FILE] ${message}`, data);
        break;
      case "trace":
        this.fileLogger.trace?.(message, data) || console.debug(`[FILE] ${message}`, data);
        break;
      case "fatal":
        this.fileLogger.fatal?.(message, data) || console.error(`[FILE] ${message}`, data);
        break;
      case "info":
        this.fileLogger.info?.(message, data) || console.info(`[FILE] ${message}`, data);
        break;
      case "warn":
        this.fileLogger.warn?.(message, data) || console.warn(`[FILE] ${message}`, data);
        break;
      case "error":
        this.fileLogger.error?.(message, data) || console.error(`[FILE] ${message}`, data);
        break;
      case "transaction":
        this.fileLogger.transaction?.(message, data) || console.info(`[FILE] 💰 ${message}`, data);
        break;
      default:
        this.fileLogger.info?.(message, data) || console.info(`[FILE] ${message}`, data);
        break;
    }

    // Console logging
    if (this.enableConsole) {
      const prefix = `[${timestamp}] [${(level as string).toUpperCase()}]`;

      switch (level) {
        case "error":
          console.error(prefix, message, data);
          break;
        case "warn":
          console.warn(prefix, message, data);
          break;
        case "transaction":
          console.info(`${prefix} 💰`, message, data);
          break;
        default:
          console.log(prefix, message, data);
      }
    }
  }

  /**
   * Fatal level logging - critical errors that require immediate attention
   */
  fatal(message: string, data: any = null) {
    return this.log("fatal", message, data);
  }

  /**
   * Trace level logging - detailed information for debugging
   */
  trace(message: string, data: any = null) {
    return this.log("trace", message, data);
  }

  /**
   * Debug level logging - only shown in development
   */
  debug(message: string, data: any = null) {
    if (!this.isProduction || this.logLevel === "debug") {
      return this.log("debug", message, data);
    }
  }

  /**
   * Information level logging
   */
  info(message: string, data: any = null) {
    return this.log("info", message, data);
  }

  /**
   * Warning level logging
   */
  warn(message: string, data: any = null) {
    return this.log("warn", message, data);
  }

  /**
   * Error level logging
   */
  error(message: string, data: any = null) {
    return this.log("error", message, data);
  }

  /**
   * Transaction logging for important business events
   */
  transaction(message: string, data: any = null) {
    return this.log("transaction", message, data);
  }
}

const log = new LogService();
export default log;
