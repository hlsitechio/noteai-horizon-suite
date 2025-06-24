
import { useEffect } from 'react';
import { useQuantumAI } from '@/contexts/QuantumAIContext';

// Hook to integrate Quantum AI with specific page contexts
export const useQuantumAIIntegration = (
  pageContext: {
    page: string;
    content?: string;
    metadata?: Record<string, any>;
  }
) => {
  const { updateContext } = useQuantumAI();

  useEffect(() => {
    updateContext(pageContext);
  }, [pageContext.page, pageContext.content, updateContext]);

  return { updateContext };
};

// Hook for components that want to add contextual AI capabilities
export const useContextualAI = () => {
  const { showContextualAssistant, addToMemory } = useQuantumAI();

  const enhanceElement = (element: HTMLElement, context: string) => {
    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      
      if (selectedText) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        showContextualAssistant(selectedText, {
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        
        addToMemory('double-click-selection', context, selectedText);
      }
    };

    element.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      element.removeEventListener('dblclick', handleDoubleClick);
    };
  };

  return { enhanceElement, showContextualAssistant, addToMemory };
};
