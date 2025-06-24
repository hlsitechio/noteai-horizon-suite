
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import MenuSide from './MenuSide';

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
  // Combine all actions into a single array
  const allActions = [...leftActions, ...rightActions];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
        >
          <div className="relative">
            {/* Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 via-slate-600/20 to-slate-500/20 rounded-3xl blur-xl scale-110" />
            
            {/* Main Container */}
            <div className="relative bg-slate-800/95 backdrop-blur-xl border border-slate-600/30 rounded-3xl shadow-2xl overflow-hidden">
              {/* Top border accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent" />
              
              {/* All Actions in a Single Row */}
              <div className="flex items-center px-6 py-4">
                <div className="flex items-center gap-2">
                  {allActions.map((action, index) => {
                    const parseGradientColors = (colorString: string) => {
                      const parts = colorString.split(' ');
                      const fromColor = parts.find(part => part.startsWith('from-'))?.replace('from-', '') || 'slate-500';
                      const toColor = parts.find(part => part.startsWith('to-'))?.replace('to-', '') || 'slate-600';
                      return { fromColor, toColor };
                    };

                    const { fromColor, toColor } = parseGradientColors(action.color);
                    
                    return (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.1 + 0.2,
                          duration: 0.3,
                          ease: "easeOut" 
                        }}
                      >
                        <button
                          onClick={action.action}
                          className={`group relative h-12 w-12 rounded-xl bg-gradient-to-br from-${fromColor} to-${toColor} hover:scale-110 transition-all duration-300 shadow-lg text-white border border-white/10`}
                        >
                          <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <action.icon className="w-5 h-5 text-white relative z-10 mx-auto" />
                          
                          {/* Tooltip */}
                          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                            <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/30 rounded-lg px-3 py-2 shadow-xl">
                              <p className="text-sm font-medium text-white whitespace-nowrap">{action.label}</p>
                              <p className="text-xs text-slate-300">{action.description}</p>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Bottom border accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent" />
            </div>
            
            {/* Status Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-500/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-green-400/30">
                AI Ready
              </Badge>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TwoSidedMenu;
