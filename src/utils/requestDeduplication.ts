
interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class RequestDeduplicator {
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly TTL = 5000;

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    console.log('API calls disabled - request deduplication blocked for key:', key);
    throw new Error('API calls are disabled');
  }

  private cleanup() {
    // Do nothing - no requests to clean up
  }

  clear() {
    console.log('API calls disabled - clearing request cache');
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();
