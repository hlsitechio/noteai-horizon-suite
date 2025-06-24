
import React, { useState } from 'react';
import { 
  Command, 
  MessageSquare, 
  FileText, 
  Search,
  PenTool,
  Target,
  Settings,
  BookOpen,
  Zap,
  Bot
} from 'lucide-react';
import { useQuantumAI } from '@/contexts/QuantumAIContext';
import { useNavigate } from 'react-router-dom';
import ToolbarButton from './ToolbarButton';
import TwoSidedMenu from './TwoSidedMenu';

const QuantumAI3DToolbar: React.FC = () => {
  const { showCommandPalette } = useQuantumAI();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const leftActions = [
    {
      icon: Command,
      label: 'Command Palette',
      description: '⌘K',
      action: () => showCommandPalette(),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageSquare,
      label: 'AI Chat',
      description: 'Chat Assistant',
      action: () => navigate('/app/chat'),
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: PenTool,
      label: 'Smart Editor',
      description: 'AI Writing',
      action: () => navigate('/app/editor'),
      color: 'from-purple-500 to-blue-500'
    }
  ];

  const rightActions = [
    {
      icon: FileText,
      label: 'Notes',
      description: 'Smart Notes',
      action: () => navigate('/app/notes'),
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Search,
      label: 'AI Search',
      description: 'Find Anything',
      action: () => showCommandPalette(),
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Target,
      label: 'Focus Mode',
      description: 'Deep Work',
      action: () => navigate('/app/editor'),
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      {/* Two-Sided Menu */}
      <TwoSidedMenu 
        isVisible={isExpanded}
        leftActions={leftActions}
        rightActions={rightActions}
      />

      {/* Main Button */}
      <ToolbarButton 
        isExpanded={isExpanded}
        onClick={handleMainButtonClick}
      />
    </div>
  );
};

export default QuantumAI3DToolbar;
