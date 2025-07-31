
import React from 'react';
import { motion } from 'framer-motion';
import type { QuickActionsMenuProps } from './types';

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  isVisible,
  actions,
  onActionClick
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="absolute bottom-20 right-0 mb-2 bg-card/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-large p-4 min-w-64"
    >
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onActionClick(action.action)}
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
  );
};

export default QuickActionsMenu;
