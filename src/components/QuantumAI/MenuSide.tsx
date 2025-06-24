
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MenuAction {
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  action: () => void;
  color: string;
}

interface MenuSideProps {
  actions: MenuAction[];
  side: 'left' | 'right';
  className?: string;
}

const MenuSide: React.FC<MenuSideProps> = ({ actions, side, className = '' }) => {
  const parseGradientColors = (colorString: string) => {
    const parts = colorString.split(' ');
    const fromColor = parts.find(part => part.startsWith('from-'))?.replace('from-', '') || 'slate-500';
    const toColor = parts.find(part => part.startsWith('to-'))?.replace('to-', '') || 'slate-600';
    return { fromColor, toColor };
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {actions.map((action, index) => {
          const { fromColor, toColor } = parseGradientColors(action.color);
          const delay = side === 'left' ? index * 0.1 : (actions.length - 1 - index) * 0.1;
          
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: delay + 0.2,
                duration: 0.3,
                ease: "easeOut" 
              }}
            >
              <Button
                variant="ghost"
                size="lg"
                onClick={action.action}
                className={`group relative h-12 w-12 rounded-xl bg-gradient-to-br from-${fromColor} to-${toColor} hover:scale-110 transition-all duration-300 shadow-lg text-white border border-white/10`}
              >
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <action.icon className="w-5 h-5 text-white relative z-10" />
                
                {/* Tooltip */}
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/30 rounded-lg px-3 py-2 shadow-xl">
                    <p className="text-sm font-medium text-white whitespace-nowrap">{action.label}</p>
                    <p className="text-xs text-slate-300">{action.description}</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuSide;
