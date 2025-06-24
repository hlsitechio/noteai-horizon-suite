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

const menuItems = [
  { icon: BookOpen, label: 'Dashboard', path: '/app/home', color: 'text-blue-500' },
  { icon: Plus, label: 'AI Chat', path: '/app/chat', color: 'text-emerald-500' },
  { icon: PenTool, label: 'Editor', path: '/app/editor', color: 'text-purple-500' },
  { icon: Calendar, label: 'Calendar', path: '/app/calendar', color: 'text-orange-500' },
  { icon: Settings, label: 'Settings', path: '/app/settings', color: 'text-gray-500' },
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
                        ? 'bg-slate-600 text-white shadow-lg' 
                        : 'hover:bg-muted hover:text-foreground hover:shadow-md'
                    }`}
                  >
                    <motion.div
                      variants={iconVariants}
                      animate={isCollapsed ? 'collapsed' : 'expanded'}
                      className="relative z-10"
                    >
                      <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-white' : item.color}`} />
                    </motion.div>
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute inset-0 bg-slate-600 -z-10"
                        layoutId="activeBackground"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                isActive={location.pathname === item.path}
                className={`h-11 rounded-xl transition-all duration-200 relative overflow-hidden group ${
                  location.pathname === item.path 
                    ? 'bg-slate-600 text-white shadow-md' 
                    : 'hover:bg-muted hover:text-foreground hover:translate-x-1'
                }`}
              >
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute inset-0 bg-slate-600 -z-10"
                    layoutId="activeBackground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 relative z-20 ${location.pathname === item.path ? 'text-white' : item.color}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className={`truncate font-medium relative z-20 ${location.pathname === item.path ? 'text-white' : 'text-foreground'}`}
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
