import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserPresenceProps {
  users: Array<{
    clientId: number;
    user: {
      id: string;
      name: string;
      color: string;
    };
    cursor?: {
      x: number;
      y: number;
    };
    selection?: any;
  }>;
  className?: string;
}

export const UserPresence: React.FC<UserPresenceProps> = ({ users, className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {users.length > 0 && (
        <>
          <div className="flex -space-x-2">
            {users.slice(0, 3).map(({ clientId, user }) => (
              <Avatar
                key={clientId}
                className="w-8 h-8 border-2 border-background"
                style={{ borderColor: user.color }}
              >
                <AvatarFallback 
                  style={{ backgroundColor: user.color + '20', color: user.color }}
                  className="text-xs font-medium"
                >
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {users.length > 3 && (
              <Avatar className="w-8 h-8 border-2 border-background">
                <AvatarFallback className="text-xs bg-muted">
                  +{users.length - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {users.length === 1 
              ? `${users[0].user.name} is online`
              : `${users.length} users online`
            }
          </div>
        </>
      )}
    </div>
  );
};

interface CursorOverlayProps {
  cursors: Array<{
    clientId: number;
    user: {
      id: string;
      name: string;
      color: string;
    };
    cursor?: {
      x: number;
      y: number;
    };
  }>;
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({ cursors }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {cursors
        .filter(({ cursor }) => cursor)
        .map(({ clientId, user, cursor }) => (
          <div
            key={clientId}
            className="absolute transition-all duration-150 ease-out"
            style={{
              left: cursor!.x,
              top: cursor!.y,
              transform: 'translate(-2px, -2px)',
            }}
          >
            {/* Cursor pointer */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-sm"
            >
              <path
                d="M8.5 1.5L1.5 8.5L8.5 15.5L15.5 8.5L8.5 1.5Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            
            {/* User name badge */}
            <Badge
              className="ml-4 -mt-1 text-xs font-medium shadow-lg"
              style={{ 
                backgroundColor: user.color,
                color: 'white',
                border: 'none'
              }}
            >
              {user.name}
            </Badge>
          </div>
        ))}
    </div>
  );
};