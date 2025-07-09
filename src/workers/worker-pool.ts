/**
 * Worker Pool Manager
 * Manages worker threads using Piscina for optimal performance
 */

import Piscina from 'piscina';
import { resolve } from 'path';

// Worker pool configuration
interface WorkerPoolConfig {
  maxThreads?: number;
  minThreads?: number;
  idleTimeout?: number;
  maxQueue?: number;
}

// Default configuration optimized for different device types
const getDefaultConfig = (): WorkerPoolConfig => {
  const cores = navigator.hardwareConcurrency || 4;
  
  // Adjust based on available CPU cores
  if (cores <= 2) {
    // Low-end devices - conservative approach
    return {
      maxThreads: 2,
      minThreads: 1,
      idleTimeout: 30000, // 30 seconds
      maxQueue: 10
    };
  } else if (cores <= 4) {
    // Mid-range devices
    return {
      maxThreads: 3,
      minThreads: 1,
      idleTimeout: 60000, // 1 minute
      maxQueue: 20
    };
  } else {
    // High-end devices
    return {
      maxThreads: Math.min(cores - 1, 6), // Leave one core for main thread
      minThreads: 2,
      idleTimeout: 120000, // 2 minutes
      maxQueue: 50
    };
  }
};

class WorkerPoolManager {
  private aiPool: Piscina | null = null;
  private ocrPool: Piscina | null = null;
  private isInitialized = false;

  async initialize(config?: WorkerPoolConfig): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const finalConfig = { ...getDefaultConfig(), ...config };
    
    try {
      console.log('[Worker Pool] Initializing with config:', finalConfig);
      
      // Initialize AI processing pool
      this.aiPool = new Piscina({
        filename: new URL('../workers/ai-worker.ts', import.meta.url).href,
        maxThreads: finalConfig.maxThreads,
        minThreads: finalConfig.minThreads,
        idleTimeout: finalConfig.idleTimeout,
        maxQueue: finalConfig.maxQueue,
      });

      // Initialize OCR processing pool
      this.ocrPool = new Piscina({
        filename: new URL('../workers/ocr-worker.ts', import.meta.url).href,
        maxThreads: Math.max(1, Math.floor((finalConfig.maxThreads || 2) / 2)), // Use fewer threads for OCR
        minThreads: 1,
        idleTimeout: finalConfig.idleTimeout,
        maxQueue: finalConfig.maxQueue,
      });

      this.isInitialized = true;
      console.log('[Worker Pool] Successfully initialized');
      
    } catch (error) {
      console.error('[Worker Pool] Initialization failed:', error);
      throw error;
    }
  }

  async runAITask<T = any>(task: any): Promise<T> {
    if (!this.aiPool) {
      throw new Error('AI worker pool not initialized');
    }

    try {
      const result = await this.aiPool.run(task);
      return result;
    } catch (error) {
      console.error('[Worker Pool] AI task failed:', error);
      throw error;
    }
  }

  async runOCRTask<T = any>(task: any, progressCallback?: (progress: number) => void): Promise<T> {
    if (!this.ocrPool) {
      throw new Error('OCR worker pool not initialized');
    }

    try {
      // For progress callbacks, we need to handle them differently
      // Since Piscina doesn't support callbacks directly, we'll poll for progress
      const result = await this.ocrPool.run(task);
      return result;
    } catch (error) {
      console.error('[Worker Pool] OCR task failed:', error);
      throw error;
    }
  }

  getStats() {
    return {
      ai: this.aiPool ? {
        threads: this.aiPool.threads.length,
        queueSize: this.aiPool.queueSize,
        completed: this.aiPool.completed,
        duration: this.aiPool.duration
      } : null,
      ocr: this.ocrPool ? {
        threads: this.ocrPool.threads.length,
        queueSize: this.ocrPool.queueSize,
        completed: this.ocrPool.completed,
        duration: this.ocrPool.duration
      } : null
    };
  }

  async destroy(): Promise<void> {
    console.log('[Worker Pool] Destroying worker pools...');
    
    const promises: Promise<void>[] = [];
    
    if (this.aiPool) {
      promises.push(this.aiPool.destroy());
      this.aiPool = null;
    }
    
    if (this.ocrPool) {
      promises.push(this.ocrPool.destroy());
      this.ocrPool = null;
    }
    
    await Promise.all(promises);
    this.isInitialized = false;
    
    console.log('[Worker Pool] Successfully destroyed');
  }
}

// Singleton instance
export const workerPool = new WorkerPoolManager();

// Initialize worker pool when module is loaded
if (typeof window !== 'undefined') {
  workerPool.initialize().catch(console.error);
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    workerPool.destroy().catch(console.error);
  });
}

export default workerPool;