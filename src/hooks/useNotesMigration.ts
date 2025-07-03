import { useOptimizedNotes } from '../contexts/OptimizedNotesContext';

/**
 * Migration hook to provide backward compatibility
 * This allows existing components to continue working while we transition to the optimized context
 * 
 * @deprecated Use useOptimizedNotes directly for better performance
 */
export const useNotes = () => {
  return useOptimizedNotes();
};

// Re-export the optimized hook as the primary export
export { useOptimizedNotes };