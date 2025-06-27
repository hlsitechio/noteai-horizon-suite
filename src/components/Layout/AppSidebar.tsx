
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CogIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  CodeBracketIcon,
  Squares2X2Icon,
  ChartBarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { icon: Squares2X2Icon, label: 'Dashboard', path: '/app/dashboard' },
  { icon: PlusIcon, label: 'AI Chat', path: '/app/chat' },
  { icon: PencilIcon, label: 'Editor', path: '/app/editor' },
  { icon: MagnifyingGlassIcon, label: 'Notes', path: '/app/notes' },
  { icon: ChartBarIcon, label: 'Analytics', path: '/app/analytics' },
  { icon: CogIcon, label: 'Settings', path: '/app/settings' },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <CodeBracketIcon className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Online Note AI
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              {user?.name?.[0]}
            </AvatarFallback>
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
      </SidebarFooter>
    </Sidebar>
  );
}
