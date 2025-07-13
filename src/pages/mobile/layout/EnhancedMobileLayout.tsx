import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, FileText, MessageSquare, FolderOpen, BarChart3, Settings } from 'lucide-react';

const EnhancedMobileLayout: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/mobile/dashboard' },
    { icon: FileText, label: 'Notes', path: '/mobile/notes' },
    { icon: MessageSquare, label: 'Chat', path: '/mobile/chat' },
    { icon: FolderOpen, label: 'Projects', path: '/mobile/projects' },
    { icon: BarChart3, label: 'Analytics', path: '/mobile/analytics' },
    { icon: Settings, label: 'Settings', path: '/mobile/settings' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-lg font-semibold">NoteAI Horizon</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-background border-t border-border">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs space-y-1 ${
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default EnhancedMobileLayout;