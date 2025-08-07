type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isDebugEnabled = process.env.DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === 'true';

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      context
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && !this.isDebugEnabled) {
      return level === 'error';
    }
    return true;
  }

  private formatOutput(entry: LogEntry): string {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const contextStr = entry.context ? ` [${entry.context}]` : '';
    return `${prefix}${contextStr} ${entry.message}`;
  }

  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, data, context);
    const output = this.formatOutput(entry);

    switch (level) {
      case 'debug':
        console.debug(output, data ? data : '');
        break;
      case 'info':
        console.info(output, data ? data : '');
        break;
      case 'warn':
        console.warn(output, data ? data : '');
        break;
      case 'error':
        console.error(output, data ? data : '');
        break;
    }
  }

  debug(message: string, data?: any, context?: string): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: any, context?: string): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: string): void {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: any, context?: string): void {
    this.log('error', message, data, context);
  }

  // Métodos específicos para APIs
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, data, 'API');
  }

  apiResponse(method: string, url: string, status: number, data?: any): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    this.log(level, `API Response: ${method} ${url} - ${status}`, data, 'API');
  }

  apiError(method: string, url: string, error: any): void {
    this.error(`API Error: ${method} ${url}`, error, 'API');
  }

  // Métodos específicos para autenticação
  authFlow(step: string, data?: any): void {
    this.info(`Auth Flow: ${step}`, data, 'AUTH');
  }

  authError(step: string, error: any): void {
    this.error(`Auth Error: ${step}`, error, 'AUTH');
  }

  // Método para contexto geral
  withContext(context: string) {
    return {
      debug: (message: string, data?: any) => this.debug(message, data, context),
      info: (message: string, data?: any) => this.info(message, data, context),
      warn: (message: string, data?: any) => this.warn(message, data, context),
      error: (message: string, data?: any) => this.error(message, data, context),
    };
  }
}

export const logger = new Logger();
export type { LogLevel, LogEntry };
