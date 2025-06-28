
/**
 * Router fallback utilities to handle missing router context
 */

export function ensureRouterContext<T>(routerContext: T | null | undefined, fallback: T): T {
  if (!routerContext) {
    console.warn('Router context not found, using fallback.');
    return fallback;
  }
  return routerContext;
}

export function safeNavigate(navigate: Function | null | undefined, path: string, options?: any) {
  if (navigate && typeof navigate === 'function') {
    try {
      navigate(path, options);
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to window.location
      window.location.href = path;
    }
  } else {
    console.warn('Navigate function not available, using window.location');
    window.location.href = path;
  }
}

export function safeUseLocation(useLocation: Function | null | undefined, fallback = { pathname: '/', search: '', hash: '' }) {
  if (useLocation && typeof useLocation === 'function') {
    try {
      return useLocation();
    } catch (error) {
      console.warn('useLocation hook failed, using fallback:', error);
      return fallback;
    }
  }
  
  console.warn('useLocation hook not available, using fallback');
  return fallback;
}
