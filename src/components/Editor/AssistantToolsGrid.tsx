
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Search, Settings, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AssistantToolsGridProps {
  content: string;
}

const AssistantToolsGrid: React.FC<AssistantToolsGridProps> = ({ content }) => {
  const tools = [
    { 
      icon: Sparkles, 
      label: 'Writing Suggestions', 
      color: 'text-purple-600 dark:text-purple-400',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      hoverGradient: 'hover:from-purple-500/30 hover:to-pink-500/30'
    },
    { 
      icon: Bot, 
      label: 'Generate Ideas', 
      color: 'text-blue-600 dark:text-blue-400',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      hoverGradient: 'hover:from-blue-500/30 hover:to-cyan-500/30'
    },
    { 
      icon: Search, 
      label: 'Research Topic', 
      color: 'text-emerald-600 dark:text-emerald-400',
      bgGradient: 'from-emerald-500/20 to-teal-500/20',
      hoverGradient: 'hover:from-emerald-500/30 hover:to-teal-500/30'
    },
    { 
      icon: Settings, 
      label: 'Tone Adjustment', 
      color: 'text-orange-600 dark:text-orange-400',
      bgGradient: 'from-orange-500/20 to-red-500/20',
      hoverGradient: 'hover:from-orange-500/30 hover:to-red-500/30'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      {tools.map((tool, index) => (
        <Tooltip key={tool.label}>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className={`w-10 h-10 glass shadow-medium bg-gradient-to-br ${tool.bgGradient} ${tool.hoverGradient} transition-all duration-300 relative overflow-hidden group`}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  whileHover={{ 
                    rotate: [0, 5, -5, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <tool.icon className={`w-5 h-5 ${tool.color} drop-shadow-sm`} />
                </motion.div>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{tool.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}

      {content.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)"
              }}
              className="w-10 h-10 glass shadow-medium rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10"
                animate={{
                  x: [-100, 100],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="relative z-10"
              >
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1 drop-shadow-sm" />
              </motion.div>
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium relative z-10">
                {content.split(' ').filter(w => w.length > 0).length}
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Word count: {content.split(' ').filter(w => w.length > 0).length}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </motion.div>
  );
};

export default AssistantToolsGrid;
