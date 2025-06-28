
interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class RequestDeduplicator {
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly TTL = 5000; // 5 seconds TTL for pending requests

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Clean up expired requests
    this.cleanup();

    const existing = this.pendingRequests.get(key);
    
    if (existing) {
      console.log(`Deduplicating request for key: ${key}`);
      return existing.promise;
    }

    const promise = requestFn();
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    try {
      const result = await promise;
      this.pendingRequests.delete(key);
      return result;
    } catch (error) {
      this.pendingRequests.delete(key);
      throw error;
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > this.TTL) {
        this.pendingRequests.delete(key);
      }
    }
  }

  clear() {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();
