
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Command, 
  MessageSquare, 
  FileText, 
  Search,
  Settings,
  Zap,
  Bot,
  PenTool,
  BookOpen,
  Target
} from 'lucide-react';
import { useQuantumAI } from '@/contexts/QuantumAIContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const QuantumAI3DToolbar: React.FC = () => {
  const { state, showCommandPalette } = useQuantumAI();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toolbarActions = [
    {
      icon: Command,
      label: 'Command Palette',
      description: '⌘K',
      action: () => showCommandPalette(),
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: MessageSquare,
      label: 'AI Chat',
      description: 'Chat Assistant',
      action: () => navigate('/app/chat'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: PenTool,
      label: 'Smart Editor',
      description: 'AI Writing',
      action: () => navigate('/app/editor'),
      color: 'from-green-500 to-teal-500'
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

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence>
        {/* Expanded Toolbar */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <div className="relative">
              {/* Glowing Background Bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl scale-110" />
              
              {/* Main Toolbar Container */}
              <div className="relative bg-card/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-2xl p-4">
                <div className="flex items-center gap-3">
                  {toolbarActions.map((tool, index) => (
                    <motion.div
                      key={tool.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: "easeOut" 
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={tool.action}
                        className="group relative h-14 w-14 rounded-xl bg-gradient-to-br hover:scale-105 transition-all duration-300 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, var(--gradient-from), var(--gradient-to))`,
                          '--gradient-from': tool.color.split(' ')[0].replace('from-', ''),
                          '--gradient-to': tool.color.split(' ')[2].replace('to-', '')
                        } as any}
                      >
                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <tool.icon className="w-6 h-6 text-white relative z-10" />
                        
                        {/* Tooltip */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="bg-card/95 backdrop-blur-xl border border-border/20 rounded-lg px-3 py-2 shadow-xl">
                            <p className="text-sm font-medium text-foreground whitespace-nowrap">{tool.label}</p>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                
                {/* Status Indicator */}
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    AI Ready
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Button */}
      <motion.button
        onClick={handleMainButtonClick}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative"
      >
        {/* 3D Button Container */}
        <div className="relative w-16 h-16">
          {/* Shadow/Base Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl transform translate-y-2 blur-sm opacity-50" />
          
          {/* Middle Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl transform translate-y-1" />
          
          {/* Top Layer */}
          <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl border border-white/20 shadow-2xl overflow-hidden group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-cyan-500 transition-all duration-300">
            
            {/* Glowing Border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                 style={{ mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)', maskComposite: 'exclude' }} />
            
            {/* Inner Glow */}
            <div className="absolute inset-1 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon Container */}
            <div className="flex items-center justify-center w-full h-full relative z-10">
              <motion.div
                animate={{ 
                  rotate: state.isVisible ? 180 : 0,
                  scale: isExpanded ? 1.2 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <Brain className="w-8 h-8 text-white filter drop-shadow-lg" />
              </motion.div>
            </div>
            
            {/* Sparkle Effects */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
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
            {state.isVisible && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/50"
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
        {state.isVisible && (
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
        
        {/* Keyboard Shortcut Hint */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-card/95 backdrop-blur-xl border border-border/20 rounded-lg px-2 py-1 shadow-xl">
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">⌘K</span>
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default QuantumAI3DToolbar;
