import { useDebounce } from 'use-debounce';

/**
 * Debounces a value with configurable delay
 * Prevents excessive state updates and API calls
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debouncedValue] = useDebounce(value, delay);
  return debouncedValue;
}

/**
 * Debounces a callback function
 * Useful for event handlers that shouldn't fire too frequently
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 250
): T {
  const [debouncedCallback] = useDebounce(callback, delay);
  return debouncedCallback;
}