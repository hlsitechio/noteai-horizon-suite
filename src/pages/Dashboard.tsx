
import React from 'react';
import { Plus, BookOpen, Heart, Calendar, TrendingUp, Clock, Users, Target, BarChart3, Activity } from 'lucide-react';
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 ${isMobile ? 'w-full' : 'w-full'}`}>
      <div className={`${isMobile ? 'px-4 py-6' : 'px-8 py-8'} space-y-8 w-full max-w-7xl mx-auto`}>
        {/* Executive Header */}
        <div className={`flex w-full ${isMobile ? 'flex-col space-y-6' : 'justify-between items-start'}`}>
          <div className={`${isMobile ? 'text-center' : ''} space-y-2`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white dark:text-slate-900" />
              </div>
              <div>
                <h1 className={`font-semibold text-slate-900 dark:text-slate-100 tracking-tight ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  Executive Dashboard
                </h1>
                <p className={`text-slate-600 dark:text-slate-400 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Welcome back, {user?.name?.split(' ')[0]}
                </p>
              </div>
            </div>
            <p className={`text-slate-500 dark:text-slate-500 ${isMobile ? 'text-sm' : 'text-base'} max-w-2xl`}>
              Comprehensive overview of your knowledge management system and productivity metrics.
            </p>
          </div>
          <Button 
            size={isMobile ? "default" : "lg"} 
            onClick={handleCreateNote} 
            className={`bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${isMobile ? 'w-full py-4' : 'px-8 py-3'} font-medium`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Document
          </Button>
        </div>

        {/* KPI Metrics Cards */}
        <div className={`w-full grid gap-6 ${
          isMobile 
            ? 'grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wide">Total Documents</p>
                  <p className={`font-bold text-slate-900 dark:text-slate-100 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{totalNotes}</p>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-900/5 dark:bg-slate-100/5 flex items-center justify-center">
                  <BookOpen className={`text-slate-700 dark:text-slate-300 ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wide">Priority Items</p>
                  <p className={`font-bold text-slate-900 dark:text-slate-100 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{favoriteNotes}</p>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-rose-600" />
                    <span className="text-xs text-rose-600 font-medium">Starred</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-900/5 dark:bg-slate-100/5 flex items-center justify-center">
                  <Heart className={`text-slate-700 dark:text-slate-300 ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wide">Categories</p>
                  <p className={`font-bold text-slate-900 dark:text-slate-100 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{Object.keys(categoryCounts).length}</p>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Organized</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-900/5 dark:bg-slate-100/5 flex items-center justify-center">
                  <TrendingUp className={`text-slate-700 dark:text-slate-300 ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wide">This Week</p>
                  <p className={`font-bold text-slate-900 dark:text-slate-100 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                    {notes.filter(note => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(note.createdAt) > weekAgo;
                    }).length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-violet-600" />
                    <span className="text-xs text-violet-600 font-medium">Recent</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-900/5 dark:bg-slate-100/5 flex items-center justify-center">
                  <Calendar className={`text-slate-700 dark:text-slate-300 ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Section */}
        <div className={`w-full grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* Recent Activity */}
          <Card className="w-full border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="p-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <CardTitle className={`flex items-center gap-3 ${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-900 dark:text-slate-100`}>
                <Clock className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {recentNotes.length === 0 ? (
                <div className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}>
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className={`text-slate-400 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No documents yet</h3>
                  <p className={`text-slate-500 mb-6 max-w-sm mx-auto ${isMobile ? 'text-sm' : ''}`}>
                    Start building your knowledge base by creating your first document.
                  </p>
                  <Button onClick={handleCreateNote} size={isMobile ? "sm" : "default"} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 ${
                        isMobile ? '' : ''
                      }`}
                      onClick={() => handleEditNote(note)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {note.title}
                          </h4>
                          {note.isFavorite && (
                            <Heart className="w-4 h-4 text-rose-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {note.content || 'No content available...'}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0">
                            {note.category}
                          </Badge>
                          <span className="text-slate-400 text-xs font-medium">
                            {formatDate(note.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" 
                    size={isMobile ? "sm" : "default"}
                    onClick={() => navigate('/notes')}
                  >
                    View All Documents →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow Actions */}
          <Card className="w-full border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="p-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-900 dark:text-slate-100`}>
                Workflow Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className={`grid grid-cols-2 gap-4 w-full`}>
                <Button 
                  onClick={handleCreateNote}
                  className={`flex-col gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 border-0 shadow-md hover:shadow-lg transition-all duration-200 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
                >
                  <Plus className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  New Document
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/notes')}
                  className={`flex-col gap-3 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
                >
                  <BookOpen className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  Browse Library
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/chat')}
                  className={`flex-col gap-3 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
                >
                  <BarChart3 className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  AI Assistant
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
                  className={`flex-col gap-3 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 w-full ${isMobile ? 'h-20 text-xs' : 'h-24 text-sm'}`}
                >
                  <Heart className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  Priority Items
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
