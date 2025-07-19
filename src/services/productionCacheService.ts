/**
 * Production-ready caching service with multiple cache layers and TTL support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  size: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size in bytes
  maxEntries?: number; // Maximum number of entries
  compression?: boolean; // Whether to compress large entries
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  totalSize: number;
  entryCount: number;
  hitRate: number;
}

export class ProductionCacheService {
  private static instance: ProductionCacheService;
  private memoryCache = new Map<string, CacheEntry<any>>();
  private indexedDBCache: IDBDatabase | null = null;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0,
    entryCount: 0,
    hitRate: 0
  };

  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly MAX_MEMORY_ENTRIES = 1000;
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute
  
  private cleanupTimer: number | null = null;

  static getInstance(): ProductionCacheService {
    if (!this.instance) {
      this.instance = new ProductionCacheService();
    }
    return this.instance;
  }

  private constructor() {
    this.initializeIndexedDB();
    this.startCleanupTimer();
  }

  /**
   * Initialize IndexedDB for persistent caching
   */
  private async initializeIndexedDB(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('production-cache', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDBCache = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('ttl', 'expiresAt');
        }
      };
    });
  }

  /**
   * Get data from cache (memory first, then IndexedDB)
   */
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      memoryEntry.hits++;
      this.stats.hits++;
      this.updateHitRate();
      return memoryEntry.data;
    }

    // Check IndexedDB cache
    const dbEntry = await this.getFromIndexedDB<T>(key);
    if (dbEntry) {
      // Promote to memory cache
      this.setInMemoryCache(key, dbEntry, {
        ttl: this.DEFAULT_TTL
      });
      this.stats.hits++;
      this.updateHitRate();
      return dbEntry;
    }

    this.stats.misses++;
    this.updateHitRate();
    return null;
  }

  /**
   * Set data in cache (both memory and IndexedDB)
   */
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.DEFAULT_TTL;
    
    // Set in memory cache
    this.setInMemoryCache(key, data, { ttl, ...options });
    
    // Set in IndexedDB for persistence
    await this.setInIndexedDB(key, data, ttl);
  }

  /**
   * Remove data from cache
   */
  async delete(key: string): Promise<void> {
    // Remove from memory
    const entry = this.memoryCache.get(key);
    if (entry) {
      this.stats.totalSize -= entry.size;
      this.stats.entryCount--;
    }
    this.memoryCache.delete(key);
    
    // Remove from IndexedDB
    await this.deleteFromIndexedDB(key);
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0,
      entryCount: 0,
      hitRate: 0
    };
    
    await this.clearIndexedDB();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Cache data with automatic expiration and compression
   */
  async cacheJSON<T>(key: string, data: T, ttl?: number): Promise<void> {
    const jsonString = JSON.stringify(data);
    const size = new Blob([jsonString]).size;
    
    // Use compression for large data
    const shouldCompress = size > 10 * 1024; // 10KB threshold
    
    await this.set(key, data, {
      ttl: ttl || this.DEFAULT_TTL,
      compression: shouldCompress
    });
  }

  /**
   * Cache with automatic refresh function
   */
  async cacheWithRefresh<T>(
    key: string,
    refreshFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await refreshFn();
    await this.set(key, fresh, { ttl });
    return fresh;
  }

  /**
   * Batch operations for better performance
   */
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const results: Record<string, T | null> = {};
    
    // Use Promise.all for concurrent operations
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.get<T>(key);
      })
    );
    
    return results;
  }

  async setMultiple<T>(entries: Record<string, T>, options: CacheOptions = {}): Promise<void> {
    await Promise.all(
      Object.entries(entries).map(([key, data]) => 
        this.set(key, data, options)
      )
    );
  }

  /**
   * Set data in memory cache with size tracking
   */
  private setInMemoryCache<T>(key: string, data: T, options: CacheOptions): void {
    const ttl = options.ttl || this.DEFAULT_TTL;
    const size = this.calculateSize(data);
    
    // Check if we need to evict entries
    this.evictIfNeeded(size);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      size
    };
    
    // Remove old entry if exists
    const oldEntry = this.memoryCache.get(key);
    if (oldEntry) {
      this.stats.totalSize -= oldEntry.size;
    } else {
      this.stats.entryCount++;
    }
    
    this.memoryCache.set(key, entry);
    this.stats.totalSize += size;
  }

  /**
   * Get data from IndexedDB
   */
  private async getFromIndexedDB<T>(key: string): Promise<T | null> {
    if (!this.indexedDBCache) return null;

    return new Promise((resolve) => {
      const transaction = this.indexedDBCache!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() < result.expiresAt) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => resolve(null);
    });
  }

  /**
   * Set data in IndexedDB
   */
  private async setInIndexedDB<T>(key: string, data: T, ttl: number): Promise<void> {
    if (!this.indexedDBCache) return;

    return new Promise((resolve) => {
      const transaction = this.indexedDBCache!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      const entry = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      };
      
      store.put(entry);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve(); // Fail silently
    });
  }

  /**
   * Delete from IndexedDB
   */
  private async deleteFromIndexedDB(key: string): Promise<void> {
    if (!this.indexedDBCache) return;

    return new Promise((resolve) => {
      const transaction = this.indexedDBCache!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.delete(key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  }

  /**
   * Clear IndexedDB
   */
  private async clearIndexedDB(): Promise<void> {
    if (!this.indexedDBCache) return;

    return new Promise((resolve) => {
      const transaction = this.indexedDBCache!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.timestamp + entry.ttl;
  }

  /**
   * Calculate approximate size of data
   */
  private calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 1024; // Default 1KB if calculation fails
    }
  }

  /**
   * Evict entries if cache is too large
   */
  private evictIfNeeded(newEntrySize: number): void {
    // Check size limit
    while (this.stats.totalSize + newEntrySize > this.MAX_MEMORY_SIZE) {
      this.evictLRU();
    }
    
    // Check entry count limit
    while (this.stats.entryCount >= this.MAX_MEMORY_ENTRIES) {
      this.evictLRU();
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Date.now();
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.timestamp < lruTime) {
        lruTime = entry.timestamp;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      const entry = this.memoryCache.get(lruKey)!;
      this.memoryCache.delete(lruKey);
      this.stats.totalSize -= entry.size;
      this.stats.entryCount--;
      this.stats.evictions++;
    }
  }

  /**
   * Start cleanup timer for expired entries
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanupExpired();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      const entry = this.memoryCache.get(key)!;
      this.memoryCache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.entryCount--;
    }
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    this.clear();
    
    if (this.indexedDBCache) {
      this.indexedDBCache.close();
      this.indexedDBCache = null;
    }
  }
}

// Export singleton instance
export const productionCache = ProductionCacheService.getInstance();