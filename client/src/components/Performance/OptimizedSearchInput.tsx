import React, { useState, useCallback, startTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebouncedValue, useDebouncedCallback } from '@/hooks/useDebouncedValue';
import { cn } from '@/lib/utils';

interface OptimizedSearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

/**
 * Optimized search input with debouncing and React 18 transitions
 * Prevents excessive API calls and maintains UI responsiveness
 */
export const OptimizedSearchInput: React.FC<OptimizedSearchInputProps> = ({
  onSearch,
  placeholder = "Search notes...",
  className,
  debounceMs = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce the search query to prevent excessive API calls
  const debouncedQuery = useDebouncedValue(inputValue, debounceMs);
  
  // Use debounced callback for the search function
  const debouncedSearch = useDebouncedCallback(
    useCallback((query: string) => {
      setIsSearching(true);
      
      // Use startTransition to mark this as a non-urgent update
      startTransition(() => {
        onSearch(query);
        setIsSearching(false);
      });
    }, [onSearch]),
    debounceMs
  );

  // Trigger search when debounced query changes
  React.useEffect(() => {
    debouncedSearch(debouncedQuery);
  }, [debouncedQuery, debouncedSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
    startTransition(() => {
      onSearch('');
    });
  }, [onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};