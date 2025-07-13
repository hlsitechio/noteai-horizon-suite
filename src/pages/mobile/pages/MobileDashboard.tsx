import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bell, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: 'Total Notes', value: '42', color: 'text-blue-600' },
    { label: 'This Week', value: '8', color: 'text-green-600' },
    { label: 'Favorites', value: '12', color: 'text-yellow-600' },
    { label: 'Projects', value: '3', color: 'text-purple-600' },
  ];

  const recentNotes = [
    { title: 'Meeting Notes', date: '2 hours ago', preview: 'Discussion about project timeline...' },
    { title: 'Ideas for App', date: '1 day ago', preview: 'New features to implement...' },
    { title: 'Research Notes', date: '2 days ago', preview: 'Findings from user research...' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">What would you like to work on today?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => navigate('/app/editor')}
          className="h-20 flex flex-col space-y-2"
        >
          <Plus className="h-6 w-6" />
          <span>New Note</span>
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/mobile/notes')}
          className="h-20 flex flex-col space-y-2"
        >
          <Search className="h-6 w-6" />
          <span>Search Notes</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recent Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentNotes.map((note, index) => (
            <div key={index} className="p-3 border border-border rounded-lg">
              <div className="font-medium">{note.title}</div>
              <div className="text-sm text-muted-foreground">{note.date}</div>
              <div className="text-sm mt-1 line-clamp-2">{note.preview}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileDashboard;