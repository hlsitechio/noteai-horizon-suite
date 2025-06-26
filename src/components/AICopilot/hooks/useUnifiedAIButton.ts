
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuantumAI } from '@/contexts/QuantumAIContext';
import { Command, MessageSquare, PenTool, FileText, Search, Target } from 'lucide-react';
import type { QuickAction } from '../types';

export const useUnifiedAIButton = () => {
  const navigate = useNavigate();
  const { showCommandPalette } = useQuantumAI();
  const [isDragging, setIsDragging] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);

  const quickActions: QuickAction[] = [
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
    },
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

  const handleDragStart = () => {
    setIsDragging(true);
    setShowQuickActions(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent, onClick: () => void) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    
    if (e.detail === 1) {
      // Single click - show quick actions or trigger main action
      if (showQuickActions) {
        onClick();
      } else {
        setShowQuickActions(true);
        setTimeout(() => setShowQuickActions(false), 5000); // Auto-hide after 5 seconds
      }
    } else if (e.detail === 2) {
      // Double click - directly open main AI interface
      onClick();
      setShowQuickActions(false);
    }
  };

  const handleQuickAction = (action: () => void) => {
    action();
    setShowQuickActions(false);
  };

  return {
    isDragging,
    showQuickActions,
    dragRef,
    quickActions,
    handleDragStart,
    handleDragEnd,
    handleClick,
    handleQuickAction
  };
};
