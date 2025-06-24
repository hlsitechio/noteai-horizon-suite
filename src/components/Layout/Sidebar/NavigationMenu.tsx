
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  BookOpen, 
  PenTool, 
  Plus,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAccentColor } from '../../../contexts/AccentColorContext';

const menuItems = [
  { icon: BookOpen, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Plus, label: 'AI Chat', path: '/app/chat' },
  { icon: PenTool, label: 'Editor', path: '/app/editor' },
  { icon: Calendar, label: 'Calendar', path: '/app/calendar' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

const contentVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.15
    }
  }
};

const iconVariants = {
  expanded: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  collapsed: {
    scale: 1.1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
};

export function NavigationMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { accentColor } = useAccentColor();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenu className={`space-y-2 ${isCollapsed ? 'px-1' : 'px-2'}`}>
      {menuItems.map((item, index) => (
        <SidebarMenuItem key={item.path}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: isCollapsed ? 0 : 2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    className={`h-12 w-12 mx-auto rounded-xl transition-all duration-200 relative overflow-hidden ${
                      location.pathname === item.path 
                        ? 'shadow-lg border' 
                        : 'hover:bg-deep-carbon-800 hover:shadow-md text-professional-grey-400'
                    }`}
                    style={location.pathname === item.path ? {
                      backgroundColor: `${accentColor}20`,
                      color: accentColor,
                      borderColor: `${accentColor}30`
                    } : {}}
                  >
                    <motion.div
                      variants={iconVariants}
                      animate={isCollapsed ? 'collapsed' : 'expanded'}
                      className="relative z-10"
                    >
                      <item.icon 
                        className="w-5 h-5" 
                        style={location.pathname === item.path ? { color: accentColor } : {}}
                      />
                    </motion.div>
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute inset-0 -z-10 rounded-xl border"
                        layoutId="activeBackground"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                          backgroundColor: `${accentColor}20`,
                          borderColor: `${accentColor}30`
                        }}
                      />
                    )}
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium bg-deep-carbon-800 text-professional-grey-200 border border-professional-grey-700">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                isActive={location.pathname === item.path}
                className={`h-11 rounded-xl transition-all duration-200 relative overflow-hidden group ${
                  location.pathname === item.path 
                    ? 'shadow-md border' 
                    : 'hover:bg-deep-carbon-800 hover:translate-x-1 text-professional-grey-400'
                }`}
                style={location.pathname === item.path ? {
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                  borderColor: `${accentColor}30`
                } : {}}
              >
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-xl border"
                    layoutId="activeBackground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                      backgroundColor: `${accentColor}20`,
                      borderColor: `${accentColor}30`
                    }}
                  />
                )}
                <item.icon 
                  className="w-5 h-5 flex-shrink-0 relative z-20" 
                  style={location.pathname === item.path ? { color: accentColor } : {}}
                />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="truncate font-medium relative z-20 text-professional-grey-300"
                      style={location.pathname === item.path ? { color: accentColor } : {}}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </SidebarMenuButton>
            )}
          </motion.div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
