import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2, 
  Calendar,
  Clock,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatHistoryPanelProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRename = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = () => {
    if (editingSessionId && editTitle.trim()) {
      onRenameSession(editingSessionId, editTitle.trim());
    }
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  if (isCollapsed) {
    return (
      <Card className="w-16 h-full flex flex-col">
        <CardHeader className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNewSession}
            className="w-full p-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-2 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {sessions.slice(0, 5).map((session) => (
                <Button
                  key={session.id}
                  variant={currentSessionId === session.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSessionSelect(session.id)}
                  className="w-full p-2 h-10"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-full flex flex-col bg-background/95 backdrop-blur-sm">
      <CardHeader className="p-4 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Chat History</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onNewSession}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat sessions yet</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors border ${
                    currentSessionId === session.id
                      ? 'bg-primary/10 border-primary/20'
                      : 'hover:bg-muted border-transparent'
                  }`}
                  onClick={() => onSessionSelect(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingSessionId === session.id ? (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename();
                              if (e.key === 'Escape') handleCancelRename();
                            }}
                            className="h-7 text-sm"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={handleSaveRename}
                              className="h-6 px-2 text-xs"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelRename}
                              className="h-6 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium text-sm truncate mb-1">
                            {session.title}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate mb-2">
                            {session.lastMessage}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDistance(session.updatedAt, new Date(), { addSuffix: true })}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs h-4 px-1">
                              {session.messageCount}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {editingSessionId !== session.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRename(session.id, session.title);
                            }}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatHistoryPanel;