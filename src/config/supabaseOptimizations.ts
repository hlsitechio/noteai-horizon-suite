/**
 * Supabase Optimization Configuration
 * 
 * This file controls which optimizations are enabled.
 * Toggle these flags to enable/disable specific optimizations.
 */

export const OPTIMIZATION_CONFIG = {
  // Phase 1: Critical fixes
  USE_OPTIMIZED_NOTES_CONTEXT: true,
  USE_OPTIMIZED_REALTIME: true,
  USE_OPTIMIZED_AUTH: false, // Not yet implemented in AuthContext
  USE_PERFORMANCE_MONITORING: true,
  
  // Phase 2: Database optimizations
  USE_BATCH_QUERIES: true,
  USE_OPTIMIZED_INDEXES: true,
  
  // Phase 3: Advanced optimizations  
  USE_QUERY_CACHING: true,
  USE_MUTATION_BATCHING: false, // Future implementation
  USE_BACKGROUND_SYNC: false, // Future implementation
  
  // Debug settings
  ENABLE_PERFORMANCE_LOGGING: process.env.NODE_ENV === 'development',
  ENABLE_DEPRECATION_WARNINGS: process.env.NODE_ENV === 'development',
} as const;

/**
 * Performance thresholds for monitoring
 */
export const PERFORMANCE_THRESHOLDS = {
  SLOW_OPERATION_MS: 1000,
  CRITICAL_OPERATION_MS: 3000,
  MAX_REALTIME_EVENTS_PER_SECOND: 10,
  MAX_QUERY_TIME_MS: 2000,
} as const;

/**
 * Realtime configuration
 */
export const REALTIME_CONFIG = {
  THROTTLE_MS: 1000,
  MAX_CHANNELS_PER_USER: 1,
  RECONNECT_DELAY_MS: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
} as const;