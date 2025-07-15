// Enhanced DOM manipulation utilities to prevent forced reflows
import { logger } from './logger';

interface StyleChange {
  property: string;
  value: string;
  element: HTMLElement;
}

export class OptimizedDOMUtils {
  private static styleQueue: StyleChange[] = [];
  private static batchTimeout: number | null = null;
  private static readonly BATCH_DELAY = 16; // One frame
  private static readonly MAX_BATCH_SIZE = 50;

  /**
   * Batch DOM style changes to prevent forced reflows
   */
  static batchStyleChanges() {
    if (this.styleQueue.length === 0) return;

    requestAnimationFrame(() => {
      try {
        // Group changes by element for efficiency
        const elementGroups = new Map<HTMLElement, StyleChange[]>();
        
        for (const change of this.styleQueue) {
          if (!elementGroups.has(change.element)) {
            elementGroups.set(change.element, []);
          }
          elementGroups.get(change.element)!.push(change);
        }

        // Apply all changes for each element at once
        for (const [element, changes] of elementGroups) {
          for (const change of changes) {
            element.style.setProperty(change.property, change.value);
          }
        }

        this.styleQueue.length = 0;
        logger.debug(`✅ Batched ${elementGroups.size} element style updates`);
      } catch (error) {
        logger.error('Error applying batched styles:', error);
      }
    });
  }

  /**
   * Queue a style change instead of applying immediately
   */
  static queueStyleChange(element: HTMLElement, property: string, value: string) {
    // Prevent queue overflow
    if (this.styleQueue.length >= this.MAX_BATCH_SIZE) {
      this.batchStyleChanges();
    }

    this.styleQueue.push({ element, property, value });

    if (!this.batchTimeout) {
      this.batchTimeout = window.setTimeout(() => {
        this.batchStyleChanges();
        this.batchTimeout = null;
      }, this.BATCH_DELAY);
    }
  }

  /**
   * Optimized document.body style changes
   */
  static setBodyStyle(property: string, value: string) {
    this.queueStyleChange(document.body, property, value);
  }

  /**
   * Optimized document.documentElement style changes
   */
  static setDocumentStyle(property: string, value: string) {
    this.queueStyleChange(document.documentElement, property, value);
  }

  /**
   * Batch multiple CSS custom property updates
   */
  static batchCSSProperties(properties: Record<string, string>, target: HTMLElement = document.documentElement) {
    for (const [property, value] of Object.entries(properties)) {
      this.queueStyleChange(target, property, value);
    }
  }

  /**
   * Optimized overflow handling for modals/popups
   */
  static manageBodyOverflow(isOpen: boolean) {
    const value = isOpen ? 'hidden' : '';
    this.setBodyStyle('overflow', value);
  }

  /**
   * Optimized cursor management
   */
  static manageCursor(cursor: string = '') {
    this.setBodyStyle('cursor', cursor);
  }

  /**
   * Optimized user-select management
   */
  static manageUserSelect(disabled: boolean) {
    const value = disabled ? 'none' : '';
    this.setBodyStyle('user-select', value);
    this.setBodyStyle('-webkit-user-select', value);
  }

  /**
   * Force immediate batch processing (for cleanup)
   */
  static flushBatch() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    this.batchStyleChanges();
  }

  /**
   * Cleanup all pending changes
   */
  static cleanup() {
    this.flushBatch();
    this.styleQueue.length = 0;
  }
}

/**
 * Hook for optimized CSS custom property updates
 */
export const useOptimizedCSSProperties = () => {
  return {
    setCSSProperty: (property: string, value: string, element?: HTMLElement) => {
      OptimizedDOMUtils.queueStyleChange(element || document.documentElement, property, value);
    },
    setBatchCSSProperties: (properties: Record<string, string>, element?: HTMLElement) => {
      OptimizedDOMUtils.batchCSSProperties(properties, element);
    },
    flushChanges: () => {
      OptimizedDOMUtils.flushBatch();
    }
  };
};