
/**
 * Safe analytics utilities with error handling
 */

export function safeSendAnalyticsEvent(eventName: string, eventParams?: Record<string, any>) {
  // Completely silent - no analytics tracking
  return;
}

export function safeSetAnalyticsUserId(userId: string) {
  // Completely silent - no analytics tracking
  return;
}

export function safeTrackPageView(pagePath: string, pageTitle?: string) {
  // Completely silent - no analytics tracking
  return;
}

export function enableAnalyticsDebugMode() {
  // Completely silent - no analytics tracking
  return;
}

export function safeTrackError(error: Error, context?: string) {
  // Completely silent - no analytics tracking
  return;
}
