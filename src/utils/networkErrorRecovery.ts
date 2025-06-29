
/**
 * Network Error Recovery Manager
 * Handles network connectivity issues and request retries
 */

interface FailedRequest {
  url: string;
  options: RequestInit;
  timestamp: Date;
  retryCount: number;
}

class NetworkErrorRecoveryManager {
  private failedRequests: FailedRequest[] = [];
  private isOnline = navigator.onLine;
  private queuedRequests: FailedRequest[] = [];

  constructor() {
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.retryFailedRequests();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async retryFailedRequests() {
    const requestsToRetry = [...this.queuedRequests];
    this.queuedRequests = [];

    for (const request of requestsToRetry) {
      try {
        await fetch(request.url, request.options);
        this.removeFailedRequest(request);
      } catch (error) {
        this.queuedRequests.push(request);
      }
    }
  }

  private removeFailedRequest(request: FailedRequest) {
    const index = this.failedRequests.findIndex(r => r.url === request.url);
    if (index > -1) {
      this.failedRequests.splice(index, 1);
    }
  }

  getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      failedRequestsCount: this.failedRequests.length,
      queuedRequestsCount: this.queuedRequests.length
    };
  }

  getFailedRequests() {
    return this.failedRequests;
  }

  clearFailedRequests() {
    this.failedRequests = [];
    this.queuedRequests = [];
  }
}

export const networkErrorRecoveryManager = new NetworkErrorRecoveryManager();
