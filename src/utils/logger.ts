import fs from "fs";
import path from "path";

interface methodParams{
  level: string;
  message?: string;
  data?: any;
}

class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.ensureLogDirectoryExists();
  }

  ensureLogDirectoryExists() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // Create levels directory and subdirectories for each level
    const levelsDir = path.join(this.logDir, "levels");
    if (!fs.existsSync(levelsDir)) {
      fs.mkdirSync(levelsDir, { recursive: true });
    }
    
    const levelTypes = ['info', 'warn', 'error', 'transaction', 'debug', 'fatal', 'trace'];
    levelTypes.forEach(level => {
      const levelDir = path.join(levelsDir, level);
      if (!fs.existsSync(levelDir)) {
        fs.mkdirSync(levelDir, { recursive: true });
      }
    });
  }

  getLogFilePath(level?: string) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    
    // If level is provided, create file in the levels/[level] directory
    if (level) {
      // Extract clean level name from emoji-prefixed level (e.g., "ℹ️ INFO" -> "info")
      const cleanLevel = level.includes(' ') ? level.split(' ')[1]?.toLowerCase() : level.toLowerCase();
      const fileName = `${dateStr}.json`;
      return path.join(this.logDir, "levels", cleanLevel, fileName);
    }
    
    // General log file stays in the main logs directory
    const fileName = `${dateStr}.json`;
    return path.join(this.logDir, fileName);
  }

  createLogObject({ level, message, data = null }: methodParams) {
    const now = new Date();
    const timezone = process.env.LOG_TIMEZONE || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get the timezone offset for the specified timezone
    const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const targetDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const offsetMinutes = (targetDate.getTime() - utcDate.getTime()) / (1000 * 60);
    
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    const digitalTimezone = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;
    
    const timestamp = new Intl.DateTimeFormat('sv-SE', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(now).replace('T', ' ') + ` (${timezone} ${digitalTimezone})`;

    const logObject: { timestamp: string; level: string; message: string; data?: any } = {
      timestamp,
      level,
      message: message ?? "",
    };

    if (data !== null && data !== undefined) {
      logObject.data = data;
    }

    return logObject;
  }

  writeLog({level, message, data = null}: methodParams) {
    try {
      // Write to level-specific file
      const levelLogFilePath = this.getLogFilePath(level);
      // Also write to general log file
      const generalLogFilePath = this.getLogFilePath();
      
      const logObject = this.createLogObject({ level, message, data });

      // Write to both files
      this.writeToFile(levelLogFilePath, logObject);
      this.writeToFile(generalLogFilePath, logObject);

      // Also log to console in development
      if (process.env.NODE_ENV === "development") {
        const formattedMessage = `[${logObject.timestamp}] [${logObject.level}] ${logObject.message}`;
        console.log(logObject.data ? `${formattedMessage}\n${JSON.stringify(logObject.data, null, 2)}` : formattedMessage);
      }
    } catch (error) {
      console.error("Error writing to log file:", error);
    }
  }

  private writeToFile(filePath: string, logObject: any) {
    // Read existing logs or create empty array
    let logs = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        if (fileContent.trim()) {
          logs = JSON.parse(fileContent);
        }
      } catch (parseError) {
        console.error("Error parsing existing log file, creating new array:", parseError);
        logs = [];
      }
    }

    // Add new log object
    logs.push(logObject);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
  }

  info(message:string, data: any = null) {
    this.writeLog({level: "ℹ️ INFO", message, data});
  }

  warn(message:string, data: any = null) {
    this.writeLog({level: "⚠️ WARN", message, data});
  }

  error(message:string, data: any = null) {
    // If data is an Error object, extract useful information
    if (data instanceof Error) {
      const errorData = {
        name: data.name,
        message: data.message,
        stack: data.stack
      };
      this.writeLog({level: "❌ ERROR", message, data: errorData});
    } else {
      this.writeLog({level: "❌ ERROR", message, data});
    }
  }

  debug(message:string, data: any = null) {
    this.writeLog({level: "🐛 DEBUG", message, data});
  }

  fatal(message: string, data: any = null) { 
    this.writeLog({level: "💀 FATAL", message, data});
  }

  trace(message: string, data: any = null) {
    this.writeLog({ level: "🔍 TRACE", message, data });
  }

  transaction(message:string, data: any = null) {
    this.writeLog({level: "💳 TRANSACTION", message, data});
  }
}

// Create a singleton instance
const logger = new Logger();
// Export both the class and the singleton instance
export { Logger };
export default logger;
