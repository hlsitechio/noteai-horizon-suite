
/**
 * Network Error Recovery System
 * Handles network failures with intelligent retry mechanisms and CORS compliance
 */

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

interface NetworkError {
  url: string;
  method: string;
  status?: number;
  message: string;
  timestamp: Date;
  retryCount: number;
  isCorsError?: boolean;
}

class NetworkErrorRecoveryManager {
  private failedRequests: Map<string, NetworkError> = new Map();
  private retryQueue: Array<() => Promise<any>> = [];
  private isOnline = navigator.onLine;
  private originalFetch = window.fetch;

  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: (error) => this.shouldRetry(error)
  };

  constructor() {
    this.setupNetworkMonitoring();
    this.interceptFetch();
  }

  private setupNetworkMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processRetryQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private interceptFetch() {
    window.fetch = async (url: string | Request, options?: RequestInit): Promise<Response> => {
      const urlString = typeof url === 'string' ? url : url.url;
      const method = options?.method || 'GET';

      // Add CORS-friendly headers for external APIs
      const enhancedOptions = this.enhanceRequestOptions(urlString, options);

      try {
        const response = await this.originalFetch(url, enhancedOptions);
        
        // Remove from failed requests if successful
        const requestKey = `${method}:${urlString}`;
        if (this.failedRequests.has(requestKey)) {
          this.failedRequests.delete(requestKey);
        }

        return response;
      } catch (error: any) {
        // Detect CORS errors
        const isCorsError = this.isCorsError(error);
        if (isCorsError) {
          console.warn(`CORS error detected for ${urlString}:`, error);
        }

        return this.handleNetworkError(urlString, method, error, () => 
          this.originalFetch(url, enhancedOptions), isCorsError
        );
      }
    };
  }

  private enhanceRequestOptions(url: string, options?: RequestInit): RequestInit {
    const enhancedOptions: RequestInit = { ...options };

    // Add CORS headers for external API calls
    if (this.isExternalAPI(url)) {
      enhancedOptions.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...enhancedOptions.headers,
      };

      // Ensure mode is set appropriately
      if (!enhancedOptions.mode) {
        enhancedOptions.mode = 'cors';
      }
    }

    // Special handling for Supabase requests
    if (url.includes('supabase.co')) {
      enhancedOptions.credentials = 'include';
      enhancedOptions.headers = {
        'X-Client-Info': 'online-note-ai@1.0.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...enhancedOptions.headers,
      };
    }

    return enhancedOptions;
  }

  private isExternalAPI(url: string): boolean {
    return url.includes('api.openai.com') || 
           url.includes('api.openrouter.ai') || 
           url.includes('supabase.co') ||
           url.includes('google-analytics.com');
  }

  private isCorsError(error: any): boolean {
    return error.name === 'TypeError' && 
           (error.message.includes('CORS') || 
            error.message.includes('cross-origin') ||
            error.message.includes('NetworkError') ||
            error.message.includes('Failed to fetch'));
  }

  private async handleNetworkError(
    url: string, 
    method: string, 
    error: any,
    retryFn: () => Promise<Response>,
    isCorsError: boolean = false,
    config: Partial<RetryConfig> = {}
  ): Promise<Response> {
    const finalConfig = { ...this.defaultRetryConfig, ...config };
    const requestKey = `${method}:${url}`;

    let networkError = this.failedRequests.get(requestKey);
    if (!networkError) {
      networkError = {
        url,
        method,
        message: error.message,
        timestamp: new Date(),
        retryCount: 0,
        isCorsError
      };
      this.failedRequests.set(requestKey, networkError);
    }

    networkError.retryCount++;

    // Don't retry CORS errors immediately - they need different handling
    if (isCorsError && networkError.retryCount === 1) {
      console.warn(`CORS error for ${url} - attempting with different configuration`);
      
      // Try with simplified request for CORS issues
      try {
        const simplifiedOptions: RequestInit = {
          method,
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
          }
        };
        
        return await this.originalFetch(url, simplifiedOptions);
      } catch (corsRetryError) {
        console.error(`CORS retry failed for ${url}:`, corsRetryError);
      }
    }

    if (networkError.retryCount <= finalConfig.maxRetries && finalConfig.retryCondition!(error)) {
      const delay = Math.min(
        finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, networkError.retryCount - 1),
        finalConfig.maxDelay
      );

      const errorType = isCorsError ? 'CORS' : 'Network';
      console.warn(`${errorType} error for ${url}, retrying in ${delay}ms (attempt ${networkError.retryCount}/${finalConfig.maxRetries})`);

      await this.delay(delay);

      try {
        return await retryFn();
      } catch (retryError) {
        return this.handleNetworkError(url, method, retryError, retryFn, isCorsError, config);
      }
    }

    // Max retries exceeded or shouldn't retry
    if (!this.isOnline) {
      this.addToRetryQueue(() => retryFn());
    }

    throw error;
  }

  private shouldRetry(error: any): boolean {
    // Don't retry on client errors (4xx) except for 408 (timeout) and 429 (rate limit)
    if (error.status && error.status >= 400 && error.status < 500) {
      return error.status === 408 || error.status === 429;
    }

    // Retry on network errors, server errors (5xx), and timeouts
    return (
      error.name === 'TypeError' || // Network error
      error.name === 'AbortError' ||
      (error.status && error.status >= 500) || // Server error
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      !this.isOnline
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private addToRetryQueue(retryFn: () => Promise<any>) {
    this.retryQueue.push(retryFn);
  }

  private async processRetryQueue() {
    console.log(`Processing ${this.retryQueue.length} queued requests...`);
    
    const queue = [...this.retryQueue];
    this.retryQueue = [];

    for (const retryFn of queue) {
      try {
        await retryFn();
      } catch (error) {
        console.warn('Failed to retry queued request:', error);
      }
    }
  }

  public async retryFailedRequest(url: string, method: string = 'GET'): Promise<boolean> {
    const requestKey = `${method}:${url}`;
    const networkError = this.failedRequests.get(requestKey);

    if (!networkError) {
      return false;
    }

    try {
      const enhancedOptions = this.enhanceRequestOptions(url, { method });
      await this.originalFetch(url, enhancedOptions);
      this.failedRequests.delete(requestKey);
      return true;
    } catch (error) {
      console.warn(`Manual retry failed for ${url}:`, error);
      return false;
    }
  }

  public getFailedRequests(): NetworkError[] {
    return Array.from(this.failedRequests.values());
  }

  public clearFailedRequests() {
    this.failedRequests.clear();
  }

  public getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      failedRequestsCount: this.failedRequests.size,
      queuedRequestsCount: this.retryQueue.length,
      corsErrors: Array.from(this.failedRequests.values()).filter(req => req.isCorsError).length
    };
  }
}

export const networkErrorRecoveryManager = new NetworkErrorRecoveryManager();
