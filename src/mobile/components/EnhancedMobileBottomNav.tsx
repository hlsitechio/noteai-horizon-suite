
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Edit3, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotes } from '../../contexts/NotesContext';
import { useNavigate } from 'react-router-dom';

const EnhancedMobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { createNote, setCurrentNote } = useNotes();
  const navigate = useNavigate();

  const navItems = [
    { icon: FileText, label: 'Notes', path: '/mobile/notes' },
    { icon: Edit3, label: 'Write', path: '/mobile/editor' },
    { icon: Settings, label: 'Settings', path: '/mobile/settings' },
  ];

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

  return (
    <div className="relative">
      {/* Main Bottom Navigation */}
      <nav className="bg-background/95 backdrop-blur-md border-t border-border px-4 py-2 flex-shrink-0">
        <div className="flex justify-around items-center relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <Button
                  variant="ghost"
                  className={`w-full flex flex-col items-center gap-1 h-auto py-3 transition-all duration-200 ${
                    isActive 
                      ? 'text-primary bg-primary/10 scale-105' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                    {item.label}
                  </span>
                </Button>
              </Link>
            );
          })}
          
          {/* Floating Action Button */}
          <div className="absolute -top-8 right-4">
            <Button
              onClick={handleCreateNote}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-110 active:scale-95"
            >
              <Plus className="h-6 w-6 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default EnhancedMobileBottomNav;
