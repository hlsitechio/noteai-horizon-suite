
import React from 'react';
import { BarChart3, FileText, Users, Calendar, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import { useAuth } from '../../contexts/AuthContext';
import DynamicMobileHeader from '../components/DynamicMobileHeader';

const MobileDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { notes, createNote, setCurrentNote } = useOptimizedNotes();
  const { folders } = useFolders();
  const { user } = useAuth();

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'New Note',
        content: '',
        category: 'general',
        tags: [],
        isFavorite: false,
        folder_id: null,
      });
      setCurrentNote(newNote);
      navigate('/mobile/editor');
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const stats = [
    {
      title: 'Total Notes',
      value: notes.length,
      icon: FileText,
      description: 'All your notes',
      action: () => navigate('/mobile/notes')
    },
    {
      title: 'Folders',
      value: folders.length,
      icon: Users,
      description: 'Organized collections',
      action: () => navigate('/mobile/notes')
    },
    {
      title: 'Favorites',
      value: notes.filter(n => n.isFavorite).length,
      icon: TrendingUp,
      description: 'Starred notes',
      action: () => navigate('/mobile/notes')
    }
  ];

  const quickActions = [
    {
      title: 'Write Note',
      description: 'Start writing immediately',
      icon: Plus,
      action: handleCreateNote,
      variant: 'default' as const
    },
    {
      title: 'Browse Notes',
      description: 'View all your notes',
      icon: FileText,
      action: () => navigate('/mobile/notes'),
      variant: 'outline' as const
    },
    {
      title: 'Analytics',
      description: 'View insights',
      icon: BarChart3,
      action: () => navigate('/mobile/analytics'),
      variant: 'outline' as const
    }
  ];

  return (
    <div className="h-full w-full bg-background">
      <DynamicMobileHeader title="Mobile/Dashboard" />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-4">
        {/* Welcome Section with Profile Picture */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                {user?.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h1 className="text-xl font-bold mb-1">Welcome back!</h1>
              <p className="text-sm text-muted-foreground">Ready to capture your thoughts?</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3">
          {stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <Card key={stat.title} className="cursor-pointer" onClick={stat.action}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <StatIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={action.title}
                  variant={action.variant}
                  onClick={action.action}
                  className="w-full h-auto py-3 flex items-center justify-start space-x-3"
                >
                  <ActionIcon className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Recent Notes</h2>
          <div className="space-y-2">
            {notes.slice(0, 3).map((note) => (
              <Card 
                key={note.id} 
                className="cursor-pointer"
                onClick={() => {
                  setCurrentNote(note);
                  navigate('/mobile/editor');
                }}
              >
                <CardContent className="p-3">
                  <h3 className="text-sm font-medium truncate">{note.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

          {/* Bottom spacing for nav */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
