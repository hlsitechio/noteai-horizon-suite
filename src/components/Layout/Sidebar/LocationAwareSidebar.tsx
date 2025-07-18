import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, FileText, Edit3, Search, MessageSquare, Calendar, BarChart3, Settings, FolderOpen, Mic, Palette, Activity, Component, Bot, Zap } from 'lucide-react';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { SidebarHeader } from './SidebarHeader';

interface RouteConfig {
  path: string;
  label: string;
  icon: any;
  category?: 'main' | 'tools' | 'settings';
  sidebar: () => React.ReactElement;
}

const routes: RouteConfig[] = [
// Main Navigation
{
  path: "/app/dashboard",
  label: "Dashboard",
  icon: Home,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Dashboard</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Your personal dashboard with overview of all activities, quick actions, and recent updates.
        </p>
      </div>
}, {
  path: "/app/notes",
  label: "Notes",
  icon: FileText,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Create, organize, and manage your notes. Support for rich text editing and collaboration.
        </p>
      </div>
}, {
  path: "/app/editor",
  label: "Editor",
  icon: Edit3,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Editor</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Advanced text editor with formatting tools, templates, and real-time collaboration features.
        </p>
      </div>
}, {
  path: "/app/explorer",
  label: "Explorer",
  icon: Search,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Explorer</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Browse and search through your content. Find notes, files, and projects with powerful filters.
        </p>
      </div>
}, {
  path: "/app/projects",
  label: "Projects",
  icon: FolderOpen,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Manage your project realms, create new projects, and organize your work with collaborative features.
        </p>
      </div>
}, {
  path: "/app/chat",
  label: "Chat",
  icon: MessageSquare,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Chat</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          AI-powered chat interface for assistance, brainstorming, and getting instant answers.
        </p>
      </div>
}, {
  path: "/app/voice-chat",
  label: "Voice Chat",
  icon: Mic,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Voice Chat</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Voice-enabled AI conversations. Speak naturally and get intelligent responses.
        </p>
      </div>
}, {
  path: "/app/calendar",
  label: "Calendar",
  icon: Calendar,
  category: 'main',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Calendar</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Schedule and manage your events, meetings, and deadlines with integrated notifications.
        </p>
      </div>
},
// Tools Section
{
  path: "/app/analytics",
  label: "Analytics",
  icon: BarChart3,
  category: 'tools',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Analytics</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Track your productivity, usage patterns, and performance metrics with detailed insights.
        </p>
      </div>
}, {
  path: "/app/activity",
  label: "Activity",
  icon: Activity,
  category: 'tools',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Activity</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          View your recent activity, track changes, and monitor collaboration across all your projects.
        </p>
      </div>
}, {
  path: "/app/themes",
  label: "Themes",
  icon: Palette,
  category: 'tools',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Themes</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Customize your workspace appearance with beautiful themes and color schemes.
        </p>
      </div>
}, {
  path: "/app/components",
  label: "Components",
  icon: Component,
  category: 'tools',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Components</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Browse and use pre-built components to enhance your content and workflows.
        </p>
      </div>
}, {
  path: "/app/ai-features",
  label: "AI Features",
  icon: Bot,
  category: 'tools',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">AI Features</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Explore advanced AI capabilities including text generation, image analysis, and automation.
        </p>
      </div>
},
// Settings Section
{
  path: "/app/settings",
  label: "Settings",
  icon: Settings,
  category: 'settings',
  sidebar: () => <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Settings</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Configure your preferences, account settings, integrations, and privacy options.
        </p>
      </div>
}];

const CategoryLabel = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="px-6 py-2">
    <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
      {children}
    </span>
  </div>
);

interface NavigationItemProps {
  route: RouteConfig;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavigationItem = ({
  route,
  isActive,
  isCollapsed
}: NavigationItemProps) => {
  const Icon = route.icon;
  
  return (
    <Link to={route.path} className={cn("block", isCollapsed ? "px-2 mx-2" : "px-3 mx-3")}>
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className={cn(
          "w-full h-10 text-sm font-medium transition-all duration-200 rounded-lg",
          isActive 
            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          isCollapsed ? "justify-center px-0" : "justify-start gap-3"
        )}
        title={isCollapsed ? route.label : undefined}
      >
        <Icon className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
        {!isCollapsed && <span className="truncate">{route.label}</span>}
      </Button>
    </Link>
  );
};


const SidebarDescription = ({
  routes,
  currentPath,
  isCollapsed
}: {
  routes: RouteConfig[];
  currentPath: string;
  isCollapsed: boolean;
}) => {
  if (isCollapsed) return null;
  
  return <AnimatePresence mode="wait">
      <Routes>
        {routes.map(({
        path,
        sidebar
      }) => <Route key={path} path={path.replace('/app', '')} element={<motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} transition={{
        duration: 0.2
      }} className="p-6 border-t border-border/50 bg-muted/20">
                {sidebar()}
              </motion.div>} />)}
      </Routes>
    </AnimatePresence>;
};

export function LocationAwareSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isCollapsed } = useSidebarCollapse();
  
  return (
    <motion.div 
      className="h-full bg-card border-r border-border flex flex-col"
      animate={{ 
        width: isCollapsed ? '4rem' : '18rem' 
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      <SidebarHeader />
      
      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 py-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            {routes.filter(r => r.category === 'main' || !r.category).map(route => 
              <NavigationItem 
                key={route.path} 
                route={route} 
                isActive={currentPath === route.path}
                isCollapsed={isCollapsed}
              />
            )}
          </div>

          {/* Tools Section */}
          <div className="pt-4">
            {!isCollapsed && <CategoryLabel>Tools</CategoryLabel>}
            <div className="space-y-1 mt-2">
              {routes.filter(r => r.category === 'tools').map(route => 
                <NavigationItem 
                  key={route.path} 
                  route={route} 
                  isActive={currentPath === route.path}
                  isCollapsed={isCollapsed}
                />
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="pt-4">
            {!isCollapsed && <CategoryLabel>Settings</CategoryLabel>}
            <div className="space-y-1 mt-2">
              {routes.filter(r => r.category === 'settings').map(route => 
                <NavigationItem 
                  key={route.path} 
                  route={route} 
                  isActive={currentPath === route.path}
                  isCollapsed={isCollapsed}
                />
              )}
            </div>
          </div>
        </nav>
      </div>
      
      {/* Bottom Description - Only show when expanded */}
      {!isCollapsed && (
        <SidebarDescription routes={routes} currentPath={currentPath} isCollapsed={isCollapsed} />
      )}
    </motion.div>
  );
}
