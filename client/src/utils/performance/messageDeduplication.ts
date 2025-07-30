import { scheduleIdleCallback } from '../scheduler';

/**
 * Message deduplication and cleanup utilities
 */

// Track sent messages to prevent duplicates
const sentMessages = new Set<string>();
const MESSAGE_CLEANUP_INTERVAL = 60000; // Clear sent messages every minute

// Clean up sent messages periodically using scheduleIdleCallback
const scheduleCleanup = () => {
  scheduleIdleCallback(() => {
    sentMessages.clear();
    scheduleCleanup(); // Schedule next cleanup
  }, MESSAGE_CLEANUP_INTERVAL);
};

// Start cleanup scheduler
scheduleCleanup();

/**
 * Check if a message has already been sent
 */
export function hasMessageBeenSent(messageKey: string): boolean {
  return sentMessages.has(messageKey);
}

/**
 * Mark a message as sent
 */
export function markMessageAsSent(messageKey: string): void {
  sentMessages.add(messageKey);
}

/**
 * Clear all sent messages (for testing purposes)
 */
export function clearSentMessages(): void {
  sentMessages.clear();
}