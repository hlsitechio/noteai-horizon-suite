import React from 'react';
import EnhancedAICopilot from './EnhancedAICopilot';

// Keep the original interface for backward compatibility
interface AICopilotProps {
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

// Wrap the enhanced version to maintain backward compatibility
const AICopilot: React.FC<AICopilotProps> = (props) => {
  return <EnhancedAICopilot {...props} />;
};

export default AICopilot;
