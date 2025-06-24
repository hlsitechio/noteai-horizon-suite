
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
              
              <div className="flex items-center">
                {/* Left Side Menu */}
                <div className="flex items-center">
                  <MenuSide 
                    actions={leftActions} 
                    side="left"
                    className="pr-4 pl-6 py-4"
                  />
                </div>
                
                {/* Center Divider with Logo */}
                <div className="relative px-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500/30 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-slate-400" />
                  </div>
                  {/* Center accent lines */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-px bg-slate-600/50" />
                  <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-px bg-slate-600/50" />
                </div>
                
                {/* Right Side Menu */}
                <div className="flex items-center">
                  <MenuSide 
                    actions={rightActions} 
                    side="right"
                    className="pl-4 pr-6 py-4"
                  />
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
