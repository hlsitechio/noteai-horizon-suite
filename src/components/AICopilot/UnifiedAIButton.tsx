
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Command, MessageSquare, PenTool, FileText, Search, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';
import { useQuantumAI } from '@/contexts/QuantumAIContext';

interface UnifiedAIButtonProps {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  action: () => void;
  color: string;
}

const UnifiedAIButton: React.FC<UnifiedAIButtonProps> = ({ 
  onClick, 
  isActive = false, 
  className = "" 
}) => {
  const isMobile = useIsMobile();
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

  const handleClick = (e: React.MouseEvent) => {
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

  return (
    <div className="relative">
      {/* Quick Actions Menu */}
      {showQuickActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="absolute bottom-20 right-0 mb-2 bg-card/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-large p-4 min-w-64"
        >
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleQuickAction(action.action)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-background/50 hover:bg-accent/10 transition-all duration-200 hover:scale-105 group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-sm`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border/10">
            <p className="text-xs text-muted-foreground text-center">
              Single click for menu • Double click for AI Copilot
            </p>
          </div>
        </motion.div>
      )}

      {/* Main AI Button */}
      <motion.button
        ref={dragRef}
        drag={!isMobile}
        dragMomentum={false}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileHover={!isDragging ? { scale: 1.05, y: -2 } : {}}
        whileTap={!isDragging ? { scale: 0.95 } : {}}
        whileDrag={{ scale: 1.1, zIndex: 1000 }}
        onClick={handleClick}
        className={`relative z-10 group w-16 h-16 cursor-${!isMobile ? (isDragging ? 'grabbing' : 'grab') : 'pointer'} ${className}`}
        title={!isMobile ? "Drag to move • Single click for quick actions • Double click for AI Copilot" : "Single click for quick actions • Double click for AI Copilot"}
      >
        {/* 3D Button Container */}
        <div className="relative w-full h-full">
          {/* Shadow/Base Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full transform translate-y-2 blur-sm opacity-50" />
          
          {/* Middle Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full transform translate-y-1" />
          
          {/* Top Layer */}
          <div className="relative w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-full border border-slate-500/30 shadow-2xl overflow-hidden group-hover:from-slate-500 group-hover:via-slate-600 group-hover:to-slate-700 transition-all duration-300">
            
            {/* Glowing Border */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                 style={{ mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)', maskComposite: 'exclude' }} />
            
            {/* Inner Glow */}
            <div className="absolute inset-1 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon Container */}
            <div className="flex items-center justify-center w-full h-full relative z-10">
              <motion.div
                animate={{ 
                  rotate: isActive || showQuickActions ? 180 : 0,
                  scale: isActive || showQuickActions ? 1.2 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <Bot className={`w-8 h-8 text-white filter drop-shadow-lg ${isDragging ? 'opacity-70' : ''}`} />
              </motion.div>
            </div>
            
            {/* Sparkle Effects */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white rounded-full"
              />
            </div>
            
            {/* Pulse Ring */}
            {(isActive || showQuickActions) && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/50"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.7, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            )}
          </div>
        </div>
        
        {/* Activity Indicator */}
        {(isActive || showQuickActions) && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default UnifiedAIButton;
