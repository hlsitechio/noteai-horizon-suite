
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface QuantumAIState {
  isVisible: boolean;
  mode: 'command' | 'context' | 'ambient' | 'selection';
  selectedText: string;
  currentContext: {
    page: string;
    content: string;
    metadata: Record<string, any>;
  };
  position: { x: number; y: number } | null;
  sessionMemory: Array<{
    timestamp: Date;
    action: string;
    context: string;
    result?: string;
  }>;
}

interface QuantumAIContextType {
  state: QuantumAIState;
  showCommandPalette: () => void;
  showContextualAssistant: (text: string, position?: { x: number; y: number }) => void;
  hideAssistant: () => void;
  updateContext: (context: Partial<QuantumAIState['currentContext']>) => void;
  addToMemory: (action: string, context: string, result?: string) => void;
  getRelevantMemory: (query: string) => QuantumAIState['sessionMemory'];
}

const QuantumAIContext = createContext<QuantumAIContextType | undefined>(undefined);

export const useQuantumAI = () => {
  const context = useContext(QuantumAIContext);
  if (!context) {
    throw new Error('useQuantumAI must be used within a QuantumAIProvider');
  }
  return context;
};

// Safe location hook that doesn't throw if Router is not available
const useSafeLocation = () => {
  try {
    return useLocation();
  } catch (error) {
    // If useLocation fails (Router not available), return a default location
    console.warn('Router context not available, using default location');
    return { pathname: '/' };
  }
};

export const QuantumAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useSafeLocation();
  const [state, setState] = useState<QuantumAIState>({
    isVisible: false,
    mode: 'command',
    selectedText: '',
    currentContext: {
      page: '',
      content: '',
      metadata: {}
    },
    position: null,
    sessionMemory: []
  });

  // Update context when route changes
  useEffect(() => {
    if (location && location.pathname) {
      setState(prev => ({
        ...prev,
        currentContext: {
          ...prev.currentContext,
          page: location.pathname
        }
      }));
    }
  }, [location]);

  // Global keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K / Ctrl+K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showCommandPalette();
      }
      
      // Escape to hide
      if (e.key === 'Escape' && state.isVisible) {
        hideAssistant();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isVisible]);

  // Global text selection listener
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      
      if (selectedText && selectedText.length > 3) {
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          showContextualAssistant(selectedText, {
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  const showCommandPalette = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: true,
      mode: 'command',
      position: null
    }));
  }, []);

  const showContextualAssistant = useCallback((text: string, position?: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      isVisible: true,
      mode: 'selection',
      selectedText: text,
      position: position || null
    }));
  }, []);

  const hideAssistant = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: false,
      selectedText: '',
      position: null
    }));
  }, []);

  const updateContext = useCallback((context: Partial<QuantumAIState['currentContext']>) => {
    setState(prev => ({
      ...prev,
      currentContext: {
        ...prev.currentContext,
        ...context
      }
    }));
  }, []);

  const addToMemory = useCallback((action: string, context: string, result?: string) => {
    setState(prev => ({
      ...prev,
      sessionMemory: [
        ...prev.sessionMemory.slice(-19), // Keep last 20 items
        {
          timestamp: new Date(),
          action,
          context,
          result
        }
      ]
    }));
  }, []);

  const getRelevantMemory = useCallback((query: string) => {
    return state.sessionMemory.filter(item => 
      item.action.toLowerCase().includes(query.toLowerCase()) ||
      item.context.toLowerCase().includes(query.toLowerCase()) ||
      (item.result && item.result.toLowerCase().includes(query.toLowerCase()))
    ).slice(-5); // Return last 5 relevant items
  }, [state.sessionMemory]);

  const value = {
    state,
    showCommandPalette,
    showContextualAssistant,
    hideAssistant,
    updateContext,
    addToMemory,
    getRelevantMemory
  };

  return (
    <QuantumAIContext.Provider value={value}>
      {children}
    </QuantumAIContext.Provider>
  );
};
