// Sentry completely disabled
// import * as Sentry from '@sentry/react';

// No-op function to replace Sentry calls
const noOp = (...args: any[]) => {};

export const Sentry = {
  init: noOp,
  captureException: noOp,
  captureMessage: noOp,
  withScope: (callback: (scope: any) => void) => callback({}),
  withProfiler: (component: any) => component,
  withSentryRouting: (component: any) => component,
  browserTracingIntegration: () => ({}),
  replayIntegration: () => ({}),
  makeBrowserOfflineTransport: () => ({}),
  makeFetchTransport: () => ({}),
  buildLaunchDarklyFlagUsedHandler: () => () => {},
};