// src/lib/observability/logger.ts
import { defaultObservabilityConfig } from './config';
import type { LogLevel, LogEntry, LogContext } from './types';

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private config = defaultObservabilityConfig.logging;
  
  constructor(config = defaultObservabilityConfig.logging) {
    this.config = config;
  }
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log('error', message, error, metadata);
  }
  
  warn(message: string, metadata?: Record<string, any>): void {
    this.log('warn', message, undefined, metadata);
  }
  
  info(message: string, metadata?: Record<string, any>): void {
    this.log('info', message, undefined, metadata);
  }
  
  debug(message: string, metadata?: Record<string, any>): void {
    this.log('debug', message, undefined, metadata);
  }
  
  private log(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, any>
  ): void {
    const context = this.createContext();
    const entry: LogEntry = {
      level,
      message,
      error,
      context,
      metadata: this.config.sanitize 
        ? this.sanitizeMetadata(metadata)
        : metadata,
      timestamp: new Date().toISOString()
    };
    
    this.addToLogs(entry);
    this.sendToExternalService(entry);
    
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(entry);
    }
  }
  
  private createContext(): LogContext {
    return {
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      country: this.getCountry(),
      countrySource: this.getCountrySource()
    };
  }
  
  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> {
    if (!metadata) return {};
    
    const sanitized = { ...metadata };
    const sensitiveFields = ['password', 'token', 'email', 'phone', 'card', 'cvv'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
  
  private addToLogs(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }
  

private sendToExternalService(entry: LogEntry): void {
  // Option 1: Check with proper type guard
  if (typeof window !== 'undefined' && 'gtag' in window && typeof window.gtag === 'function') {
    window.gtag('event', 'log', {
      level: entry.level,
      message: entry.message
    });
  }
  
  // Option 2: Alternative - check for Google Analytics
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'log',
      level: entry.level,
      message: entry.message
    });
  }
}
  private logToConsole(entry: LogEntry): void {
    const styles:Record<LogLevel,string> = {
      error: 'color: #ef4444; font-weight: bold;',
      warn: 'color: #f59e0b; font-weight: bold;',
      info: 'color: #3b82f6;',
      debug: 'color: #6b7280;'
    };
    
    console.log(
      `%c[${entry.level.toUpperCase()}] ${entry.message}`,
      styles[entry.level],
      entry
    );
  }
  
  private getSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem('obs_session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        sessionStorage.setItem('obs_session_id', sessionId);
      }
      return sessionId;
    } catch {
      return `temp_${Date.now()}`;
    }
  }
  
  private getUserId(): string | undefined {
    try {
      const authData = localStorage.getItem('user_data');
      return authData ? JSON.parse(authData).id : undefined;
    } catch {
      return undefined;
    }
  }
  
  private getCountry(): string | undefined {
    try {
      return localStorage.getItem('user_country') || undefined;
    } catch {
      return undefined;
    }
  }
  
  private getCountrySource(): any {
    try {
      return localStorage.getItem('country_source') || undefined;
    } catch {
      return undefined;
    }
  }
  
  // Public API
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }
  
  clearLogs(): void {
    this.logs = [];
  }
  
  setConfig(config: typeof defaultObservabilityConfig.logging): void {
    this.config = config;
  }
}

// Singleton export
export const logger = Logger.getInstance();