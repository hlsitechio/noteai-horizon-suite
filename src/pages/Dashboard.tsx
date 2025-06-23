
import React from 'react';
import { Plus, BookOpen, Heart, Calendar, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';

const Dashboard: React.FC = () => {
  const { notes, setCurrentNote } = useNotes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Calculate stats
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const categoryCounts = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateNote = () => {
    setCurrentNote(null);
    navigate('/editor');
  };

  const handleEditNote = (note: any) => {
    setCurrentNote(note);
    navigate('/editor');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`min-h-screen ${isMobile ? 'w-full' : 'w-full'}`}>
      <div className={`${isMobile ? 'px-4 py-4' : 'px-6 py-6'} space-y-6 w-full`}>
        {/* Welcome Header */}
        <div className={`flex w-full ${isMobile ? 'flex-col space-y-4' : 'justify-between items-start'}`}>
          <div className={isMobile ? 'text-center' : ''}>
            <h1 className={`font-bold text-gray-800 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm mt-1' : 'mt-2'}`}>
              Here's what's happening with your notes today.
            </p>
          </div>
          <Button 
            size={isMobile ? "default" : "lg"} 
            onClick={handleCreateNote} 
            className={`rounded-xl ${isMobile ? 'w-full py-3' : ''}`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Note
          </Button>
        </div>

        {/* Stats Cards */}
        <div className={`w-full grid gap-4 ${
          isMobile 
            ? 'grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium text-xs">Total Notes</p>
                  <p className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{totalNotes}</p>
                </div>
                <BookOpen className={`text-blue-200 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 font-medium text-xs">Favorites</p>
                  <p className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{favoriteNotes}</p>
                </div>
                <Heart className={`text-red-200 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-medium text-xs">Categories</p>
                  <p className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{Object.keys(categoryCounts).length}</p>
                </div>
                <TrendingUp className={`text-green-200 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 font-medium text-xs">This Week</p>
                  <p className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                    {notes.filter(note => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(note.createdAt) > weekAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className={`text-purple-200 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Cards */}
        <div className={`w-full grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* Recent Notes */}
          <Card className="w-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
                <Clock className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {recentNotes.length === 0 ? (
                <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
                  <BookOpen className={`text-gray-300 mx-auto mb-4 ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`} />
                  <p className={`text-gray-500 mb-4 ${isMobile ? 'text-sm' : ''}`}>No notes yet</p>
                  <Button onClick={handleCreateNote} size={isMobile ? "sm" : "default"}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first note
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`flex items-start gap-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full ${
                        isMobile ? 'p-2' : 'p-3'
                      }`}
                      onClick={() => handleEditNote(note)}
                    >
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-gray-800 truncate ${isMobile ? 'text-sm' : ''}`}>
                            {note.title}
                          </h4>
                          {note.isFavorite && (
                            <Heart className="w-3 h-3 text-red-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-gray-600 line-clamp-2 mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {note.content || 'No content yet...'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {note.category}
                          </Badge>
                          <span className="text-gray-400 text-xs">
                            {formatDate(note.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    size={isMobile ? "sm" : "default"}
                    onClick={() => navigate('/notes')}
                  >
                    View all notes →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="w-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className={isMobile ? 'text-lg' : ''}>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className={`grid grid-cols-2 gap-3 w-full`}>
                <Button 
                  onClick={handleCreateNote}
                  className={`flex-col gap-2 rounded-xl w-full ${isMobile ? 'h-16 text-xs' : 'h-20'}`}
                >
                  <Plus className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  New Note
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/notes')}
                  className={`flex-col gap-2 rounded-xl w-full ${isMobile ? 'h-16 text-xs' : 'h-20'}`}
                >
                  <BookOpen className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  View Notes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/chat')}
                  className={`flex-col gap-2 rounded-xl w-full ${isMobile ? 'h-16 text-xs' : 'h-20'}`}
                >
                  <TrendingUp className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  AI Chat
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const favoriteNotes = notes.filter(note => note.isFavorite);
                    if (favoriteNotes.length > 0) {
                      setCurrentNote(favoriteNotes[0]);
                      navigate('/editor');
                    } else {
                      navigate('/notes');
                    }
                  }}
                  className={`flex-col gap-2 rounded-xl w-full ${isMobile ? 'h-16 text-xs' : 'h-20'}`}
                >
                  <Heart className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  Favorites
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
