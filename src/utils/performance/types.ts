/**
 * Performance monitoring types and interfaces
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

export type LogLevel = 'info' | 'warning' | 'error';

export interface SentryOptions {
  level: LogLevel;
  extra: Record<string, any>;
  tags: Record<string, string>;
}