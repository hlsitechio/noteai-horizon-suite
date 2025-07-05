
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../../contexts/AuthContext';

export function SidebarProfile() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg mx-1 mb-2 hover:bg-accent/30 transition-colors duration-200">
      <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-primary/30 hover:ring-primary/50 transition-all duration-200">
        <AvatarImage src={user?.avatar} className="object-cover" />
        <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/15 text-sm font-medium">
          {user?.name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {user?.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {user?.email}
        </p>
      </div>
    </div>
  );
}
