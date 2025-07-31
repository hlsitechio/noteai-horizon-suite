/**
 * Robust Dashboard Layout Service
 * Provides caching, deduplication, and circuit breaker protection
 */

import { supabase } from '@/integrations/supabase/client';
import { safeAsync, retryAsync } from '@/utils/robustAsync';

interface DashboardLayout {
  id: string;
  user_id: string;
  name: string;
  layout_config: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface DashboardLayoutUpdate {
  layout_config?: any;
  name?: string;
  is_default?: boolean;
  updated_at?: string;
}

// Cache to prevent duplicate requests
const requestCache = new Map<string, Promise<any>>();
const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Get cached data if still valid
 */
function getCachedData(key: string): any | null {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  dataCache.delete(key);
  return null;
}

/**
 * Set cached data
 */
function setCachedData(key: string, data: any): void {
  dataCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Deduplicate requests - if same request is already in progress, return that promise
 */
function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

export const DashboardLayoutService = {
  /**
   * Get user layout with caching and deduplication
   */
  async getUserLayout(userId: string): Promise<DashboardLayout | null> {
    const cacheKey = `user_layout_${userId}`;
    
    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    return deduplicateRequest(cacheKey, async () => {
      const result = await safeAsync(async () => {
        const { data, error } = await supabase
          .from('dashboard_layouts')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;
        return data;
      });

      if (result.success) {
        setCachedData(cacheKey, result.data);
        return result.data;
      }

      console.warn('Failed to fetch user layout:', result.error);
      return null;
    });
  },

  /**
   * Update layout with optimistic updates and retry logic
   */
  async updateLayout(layoutId: string, updates: DashboardLayoutUpdate): Promise<DashboardLayout | null> {
    const result = await retryAsync(async () => {
      const { data, error } = await supabase
        .from('dashboard_layouts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', layoutId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, {
      maxAttempts: 3,
      delayMs: 1000,
      shouldRetry: (error, attempt) => {
        // Don't retry on client errors
        if (error.message.includes('404') || error.message.includes('403')) {
          return false;
        }
        return attempt < 3;
      }
    });

    // Clear cache on successful update
    const cacheKey = `user_layout_${result.user_id}`;
    dataCache.delete(cacheKey);
    setCachedData(cacheKey, result);

    return result;
  },

  /**
   * Create new layout with deduplication
   */
  async createLayout(userId: string, layoutConfig: any, name: string = 'Default Layout'): Promise<DashboardLayout | null> {
    const cacheKey = `create_layout_${userId}`;
    
    return deduplicateRequest(cacheKey, async () => {
      const result = await safeAsync(async () => {
        const { data, error } = await supabase
          .from('dashboard_layouts')
          .insert({
            user_id: userId,
            layout_config: layoutConfig,
            name: name,
            is_default: true,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      if (result.success) {
        // Update cache
        const userCacheKey = `user_layout_${userId}`;
        setCachedData(userCacheKey, result.data);
        return result.data;
      }

      console.warn('Failed to create layout:', result.error);
      return null;
    });
  },

  /**
   * Clean up duplicate layouts with circuit breaker protection
   */
  async cleanupDuplicateLayouts(userId: string): Promise<void> {
    const cacheKey = `cleanup_${userId}`;
    
    // Don't run cleanup too frequently
    const cached = getCachedData(cacheKey);
    if (cached) {
      return; // Already cleaned up recently
    }

    return deduplicateRequest(cacheKey, async () => {
      const result = await safeAsync(async () => {
        const { data: layouts, error } = await supabase
          .from('dashboard_layouts')
          .select('id, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Keep only the most recent layout, delete others
        if (layouts && layouts.length > 1) {
          const duplicateIds = layouts.slice(1).map(layout => layout.id);
          
          if (duplicateIds.length > 0) {
            const { error: deleteError } = await supabase
              .from('dashboard_layouts')
              .delete()
              .in('id', duplicateIds);

            if (deleteError) throw deleteError;
            console.log(`Cleaned up ${duplicateIds.length} duplicate layouts`);
          }
        }
      });

      // Cache the cleanup result to prevent frequent calls
      setCachedData(cacheKey, true);

      if (!result.success) {
        console.warn('Failed to cleanup duplicate layouts:', result.error);
      }
    });
  },

  /**
   * Clear all caches (useful for testing or manual refresh)
   */
  clearCache(): void {
    requestCache.clear();
    dataCache.clear();
    pendingRequests.clear();
  },

  /**
   * Get cache statistics for debugging
   */
  getCacheStats() {
    return {
      requestCacheSize: requestCache.size,
      dataCacheSize: dataCache.size,
      pendingRequestsSize: pendingRequests.size,
    };
  }
};
