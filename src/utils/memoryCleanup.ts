
/**
 * Memory cleanup utilities to prevent memory leaks
 */

export function safeClearEventListeners(
  element: HTMLElement | Window | Document,
  event: string,
  handler: EventListener
) {
  try {
    if (element && typeof element.removeEventListener === 'function') {
      element.removeEventListener(event, handler);
      console.log(`Event listener removed: ${event}`);
    }
  } catch (error) {
    console.warn('Failed to remove event listener:', error);
  }
}

export function clearTimers(timerIds: (number | NodeJS.Timeout)[]) {
  timerIds.forEach((id) => {
    try {
      clearTimeout(id);
    } catch (error) {
      console.warn('Failed to clear timer:', error);
    }
  });
  console.log(`Cleared ${timerIds.length} timers`);
}

export function clearIntervals(intervalIds: (number | NodeJS.Timeout)[]) {
  intervalIds.forEach((id) => {
    try {
      clearInterval(id);
    } catch (error) {
      console.warn('Failed to clear interval:', error);
    }
  });
  console.log(`Cleared ${intervalIds.length} intervals`);
}

export function safeAbortController(controller: AbortController) {
  try {
    if (controller && !controller.signal.aborted) {
      controller.abort();
      console.log('AbortController aborted successfully');
    }
  } catch (error) {
    console.warn('Failed to abort controller:', error);
  }
}

export function cleanupResizeObserver(observer: ResizeObserver) {
  try {
    if (observer) {
      observer.disconnect();
      console.log('ResizeObserver disconnected');
    }
  } catch (error) {
    console.warn('Failed to disconnect ResizeObserver:', error);
  }
}

export function cleanupIntersectionObserver(observer: IntersectionObserver) {
  try {
    if (observer) {
      observer.disconnect();
      console.log('IntersectionObserver disconnected');
    }
  } catch (error) {
    console.warn('Failed to disconnect IntersectionObserver:', error);
  }
}

export function cleanupMutationObserver(observer: MutationObserver) {
  try {
    if (observer) {
      observer.disconnect();
      console.log('MutationObserver disconnected');
    }
  } catch (error) {
    console.warn('Failed to disconnect MutationObserver:', error);
  }
}

// Comprehensive cleanup utility for components
export class CleanupManager {
  private timers: (number | NodeJS.Timeout)[] = [];
  private intervals: (number | NodeJS.Timeout)[] = [];
  private observers: (ResizeObserver | IntersectionObserver | MutationObserver)[] = [];
  private controllers: AbortController[] = [];
  private listeners: Array<{
    element: HTMLElement | Window | Document;
    event: string;
    handler: EventListener;
  }> = [];

  addTimer(id: number | NodeJS.Timeout) {
    this.timers.push(id);
  }

  addInterval(id: number | NodeJS.Timeout) {
    this.intervals.push(id);
  }

  addObserver(observer: ResizeObserver | IntersectionObserver | MutationObserver) {
    this.observers.push(observer);
  }

  addController(controller: AbortController) {
    this.controllers.push(controller);
  }

  addListener(element: HTMLElement | Window | Document, event: string, handler: EventListener) {
    this.listeners.push({ element, event, handler });
  }

  cleanup() {
    // Clear timers and intervals
    clearTimers(this.timers);
    clearIntervals(this.intervals);

    // Disconnect observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect observer:', error);
      }
    });

    // Abort controllers
    this.controllers.forEach(controller => {
      safeAbortController(controller);
    });

    // Remove event listeners
    this.listeners.forEach(({ element, event, handler }) => {
      safeClearEventListeners(element, event, handler);
    });

    // Clear arrays
    this.timers = [];
    this.intervals = [];
    this.observers = [];
    this.controllers = [];
    this.listeners = [];

    console.log('CleanupManager: All resources cleaned up');
  }
}
