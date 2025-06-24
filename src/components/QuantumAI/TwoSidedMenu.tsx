
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface TwoSidedMenuProps {
  isVisible: boolean;
  leftActions: Array<{
    icon: React.ComponentType<any>;
    label: string;
    description: string;
    action: () => void;
    color: string;
  }>;
  rightActions: Array<{
    icon: React.ComponentType<any>;
    label: string;
    description: string;
    action: () => void;
    color: string;
  }>;
}

const TwoSidedMenu: React.FC<TwoSidedMenuProps> = ({ isVisible, leftActions, rightActions }) => {
  const parseGradientColors = (colorString: string) => {
    const parts = colorString.split(' ');
    const fromColor = parts.find(part => part.startsWith('from-'))?.replace('from-', '') || 'slate-500';
    const toColor = parts.find(part => part.startsWith('to-'))?.replace('to-', '') || 'slate-600';
    return { fromColor, toColor };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Left Side Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bottom-2 right-20 flex items-center gap-3"
          >
            {leftActions.map((action, index) => {
              const { fromColor, toColor } = parseGradientColors(action.color);
              
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1 + 0.2,
                    duration: 0.3,
                    ease: "easeOut" 
                  }}
                >
                  <button
                    onClick={action.action}
                    className={`group relative h-14 w-14 rounded-xl bg-gradient-to-br from-${fromColor} to-${toColor} hover:scale-110 transition-all duration-300 shadow-lg text-white border border-white/10`}
                  >
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <action.icon className="w-6 h-6 text-white relative z-10 mx-auto" />
                    
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/30 rounded-lg px-3 py-2 shadow-xl">
                        <p className="text-sm font-medium text-white whitespace-nowrap">{action.label}</p>
                        <p className="text-xs text-slate-300">{action.description}</p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Side Actions */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bottom-2 left-20 flex items-center gap-3"
          >
            {rightActions.map((action, index) => {
              const { fromColor, toColor } = parseGradientColors(action.color);
              
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1 + 0.2,
                    duration: 0.3,
                    ease: "easeOut" 
                  }}
                >
                  <button
                    onClick={action.action}
                    className={`group relative h-14 w-14 rounded-xl bg-gradient-to-br from-${fromColor} to-${toColor} hover:scale-110 transition-all duration-300 shadow-lg text-white border border-white/10`}
                  >
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <action.icon className="w-6 h-6 text-white relative z-10 mx-auto" />
                    
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/30 rounded-lg px-3 py-2 shadow-xl">
                        <p className="text-sm font-medium text-white whitespace-nowrap">{action.label}</p>
                        <p className="text-xs text-slate-300">{action.description}</p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <Badge className="bg-green-500/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-green-400/30">
              AI Ready
            </Badge>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TwoSidedMenu;
