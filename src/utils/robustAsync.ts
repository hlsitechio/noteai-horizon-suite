/**
 * Robust Async Utilities
 * Provides safe wrappers for async operations with retry logic and error handling
 */

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export interface SafeAsyncResult<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

/**
 * Safely executes an async function with comprehensive error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  defaultValue: T | null = null
): Promise<SafeAsyncResult<T>> {
  try {
    const data = await fn();
    return { data, error: null, success: true };
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown async error');
    return { data: defaultValue, error: err, success: false };
  }
}

/**
 * Executes an async function with retry logic
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = () => true
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxAttempts || !shouldRetry(lastError, attempt)) {
        throw lastError;
      }

      // Wait before retrying with exponential backoff
      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Creates a timeout wrapper for promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
}

/**
 * Safely executes multiple async operations in parallel
 */
export async function safeParallel<T>(
  operations: (() => Promise<T>)[],
  options: { 
    failFast?: boolean;
    timeout?: number;
  } = {}
): Promise<SafeAsyncResult<T>[]> {
  const { failFast = false, timeout } = options;

  const results = await Promise.allSettled(
    operations.map(async (op, index) => {
      try {
        const promise = op();
        const result = timeout ? await withTimeout(promise, timeout) : await promise;
        return { data: result, error: null, success: true };
      } catch (error) {
        const err = error instanceof Error ? error : new Error(`Operation ${index} failed`);
        if (failFast) throw err;
        return { data: null, error: err, success: false };
      }
    })
  );

  return results.map(result => 
    result.status === 'fulfilled' 
      ? result.value 
      : { data: null, error: new Error('Operation rejected'), success: false }
  );
}

/**
 * Debounced async function executor
 */
export function createDebouncedAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delayMs: number
): (...args: T) => Promise<R> {
  let timeoutId: number | null = null;
  let latestResolve: ((value: R | PromiseLike<R>) => void) | null = null;
  let latestReject: ((reason?: any) => void) | null = null;

  return (...args: T): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      // Cancel previous timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        // Reject previous promise
        if (latestReject) {
          latestReject(new Error('Debounced call cancelled'));
        }
      }

      latestResolve = resolve;
      latestReject = reject;

      timeoutId = window.setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
        timeoutId = null;
        latestResolve = null;
        latestReject = null;
      }, delayMs);
    });
  };
}

/**
 * Circuit breaker pattern for async operations
 */
export class CircuitBreaker<T extends any[], R> {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private fn: (...args: T) => Promise<R>,
    private options: {
      failureThreshold: number;
      resetTimeoutMs: number;
      monitoringPeriodMs: number;
    }
  ) {}

  async execute(...args: T): Promise<R> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailTime >= this.options.resetTimeoutMs) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await this.fn(...args);
      
      if (this.state === 'half-open') {
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailTime = Date.now();

    if (this.failures >= this.options.failureThreshold) {
      this.state = 'open';
    }
  }

  private reset(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  getState(): string {
    return this.state;
  }
}