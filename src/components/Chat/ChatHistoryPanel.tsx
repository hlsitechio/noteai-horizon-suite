import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2, 
  Calendar,
  Clock,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Star,
  StarOff,
  ArchiveX,
  Filter,
  SortDesc,
  Sparkles
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
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'messages'>('updated');
  const [showFavorites, setShowFavorites] = useState(false);

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
      <div className="relative w-16 h-full bg-gradient-to-b from-background via-muted/5 to-background border-r border-border/30 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 opacity-30"></div>
        <div className="absolute top-4 right-2 w-8 h-8 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        
        <div className="relative h-full flex flex-col p-3">
          {/* Expand Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="mb-3 h-10 w-10 p-0 rounded-xl hover:bg-primary/10 transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          </Button>
          
          {/* New Chat Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onNewSession}
            className="mb-4 h-10 w-10 p-0 rounded-xl border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-background to-primary/5 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 group shadow-lg"
          >
            <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          </Button>
          
          <Separator className="mb-4 bg-border/50" />
          
          {/* Recent Sessions */}
          <div className="flex-1 space-y-2">
            {sessions.slice(0, 8).map((session, index) => (
              <Button
                key={session.id}
                variant={currentSessionId === session.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onSessionSelect(session.id)}
                className={`w-10 h-10 p-0 rounded-xl transition-all duration-300 relative group ${
                  currentSessionId === session.id
                    ? 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20'
                    : 'hover:bg-muted/50 hover:scale-105'
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                <MessageSquare className={`w-4 h-4 ${
                  currentSessionId === session.id ? 'text-primary-foreground' : 'text-muted-foreground'
                } group-hover:scale-110 transition-transform`} />
                
                {currentSessionId === session.id && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse shadow-lg"></div>
                )}
              </Button>
            ))}
          </div>
          
          {/* Sessions Count */}
          {sessions.length > 0 && (
            <div className="mt-3 text-center">
              <Badge variant="secondary" className="text-xs h-5 px-2 bg-gradient-to-r from-secondary/80 to-secondary/60">
                {sessions.length}
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-80 h-full bg-gradient-to-br from-background via-primary/3 to-accent/3 border-r border-border/30 backdrop-blur-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-40"></div>
      <div className="absolute top-8 right-8 w-20 h-20 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-12 left-8 w-16 h-16 bg-accent/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative h-full flex flex-col">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-accent/8 to-primary/10 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/40 shadow-xl">
                  <MessageSquare className="w-5 h-5 text-primary drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-primary rounded-full animate-pulse shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-primary/50 rounded-full animate-ping"></div>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Chat History
                </h2>
                <p className="text-xs text-muted-foreground/80 font-medium">
                  {sessions.length} conversations
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onNewSession}
                className="h-9 px-3 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-background to-primary/5 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <Plus className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">New Chat</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-9 w-9 p-0 rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </Button>
            </div>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
            <Input
              placeholder="Search conversations, messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-2 border-muted/50 focus:border-primary/50 bg-gradient-to-r from-background to-muted/10 backdrop-blur-sm transition-all duration-200"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="text-xs h-5 px-2 bg-gradient-to-r from-primary/20 to-primary/10">
                  {filteredSessions.length}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border border-muted/50 hover:border-primary/50 bg-gradient-to-r from-background to-muted/10 transition-all duration-200">
                  <SortDesc className="w-3 h-3 mr-2" />
                  <span className="text-xs">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => setSortBy('updated')}>
                  <Clock className="w-3 h-3 mr-2" />
                  Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('created')}>
                  <Calendar className="w-3 h-3 mr-2" />
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('messages')}>
                  <MessageSquare className="w-3 h-3 mr-2" />
                  Most Messages
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
              className="h-8 px-3 rounded-lg border border-muted/50 hover:border-primary/50 bg-gradient-to-r from-background to-muted/10 transition-all duration-200"
            >
              <Star className="w-3 h-3 mr-2" />
              <span className="text-xs">Favorites</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 via-accent/15 to-primary/25 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30 shadow-2xl">
                      <MessageSquare className="w-10 h-10 text-primary drop-shadow-lg" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {searchQuery ? 'No matches found' : 'No conversations yet'}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-48 mx-auto">
                    {searchQuery ? 'Try adjusting your search terms' : 'Start a new conversation to begin chatting with AI'}
                  </p>
                </div>
              ) : (
                filteredSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-sm hover:scale-[1.02] ${
                      currentSessionId === session.id
                        ? 'bg-gradient-to-br from-primary/15 via-primary/10 to-accent/10 border-primary/30 shadow-xl shadow-primary/10'
                        : 'hover:bg-gradient-to-br hover:from-muted/30 hover:to-muted/20 border-muted/30 hover:border-primary/30 hover:shadow-lg'
                    }`}
                    onClick={() => onSessionSelect(session.id)}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeIn 0.3s ease-out forwards'
                    }}
                  >
                    {currentSessionId === session.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-2xl"></div>
                    )}
                    
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingSessionId === session.id ? (
                          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename();
                                if (e.key === 'Escape') handleCancelRename();
                              }}
                              className="h-8 text-sm rounded-xl border-2 border-primary/30 focus:border-primary/50"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={handleSaveRename}
                                className="h-7 px-3 text-xs rounded-lg bg-gradient-to-r from-success to-success/90"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelRename}
                                className="h-7 px-3 text-xs rounded-lg border border-muted/50"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-sm text-foreground truncate flex-1">
                                {session.title}
                              </h3>
                              {currentSessionId === session.id && (
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50"></div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground/80 truncate mb-3 leading-relaxed">
                              {session.lastMessage}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDistance(session.updatedAt, new Date(), { addSuffix: true })}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs h-4 px-2 bg-gradient-to-r from-secondary/80 to-secondary/60">
                                  {session.messageCount} msgs
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 rounded-lg hover:bg-accent/20 transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Toggle favorite logic would go here
                                  }}
                                >
                                  <StarOff className="w-3 h-3 text-muted-foreground" />
                                </Button>
                              </div>
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
                              className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 rounded-xl hover:bg-muted/50 transition-all duration-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 backdrop-blur-sm">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(session.id, session.title);
                              }}
                            >
                              <Edit3 className="w-3 h-3 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                // Archive logic would go here
                              }}
                            >
                              <ArchiveX className="w-3 h-3 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                              }}
                              className="text-destructive focus:text-destructive"
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
        </div>
        
        {/* Enhanced Footer Stats */}
        {sessions.length > 0 && (
          <div className="p-4 border-t border-border/30 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-lg">
            <div className="flex items-center justify-between text-xs text-muted-foreground/70">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Total: {sessions.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-accent" />
                  <span>{sessions.reduce((acc, s) => acc + s.messageCount, 0)} messages</span>
                </div>
              </div>
              {searchQuery && (
                <div className="flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  <span>{filteredSessions.length} found</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPanel;