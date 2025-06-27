
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CogIcon, 
  BookOpenIcon, 
  PencilIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  CodeBracketIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { icon: Squares2X2Icon, label: 'Dashboard', path: '/app/dashboard' },
  { icon: PlusIcon, label: 'AI Chat', path: '/app/chat' },
  { icon: PencilIcon, label: 'Editor', path: '/app/editor' },
  { icon: MagnifyingGlassIcon, label: 'Notes', path: '/app/notes' },
  { icon: CogIcon, label: 'Settings', path: '/app/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-screen w-[280px] bg-background/95 backdrop-blur-md shadow-lg z-[1000] hidden md:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <CodeBracketIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Online Note AI
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>

        <Separator />

        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
