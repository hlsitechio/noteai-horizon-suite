import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Optimized with memoization for performance
 */
let memoizedClassMerge: Map<string, string> | undefined;

export function cn(...inputs: ClassValue[]) {
  const cacheKey = inputs.join('|');
  
  if (!memoizedClassMerge) {
    memoizedClassMerge = new Map();
  }
  
  if (memoizedClassMerge.has(cacheKey)) {
    return memoizedClassMerge.get(cacheKey)!;
  }
  
  const result = twMerge(clsx(inputs));
  
  // Limit cache size to prevent memory leaks
  if (memoizedClassMerge.size > 1000) {
    memoizedClassMerge.clear();
  }
  
  memoizedClassMerge.set(cacheKey, result);
  return result;
}
