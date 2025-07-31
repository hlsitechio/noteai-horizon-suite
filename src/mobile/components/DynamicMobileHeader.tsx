
import React, { useState } from 'react';
import { Menu, Search, ArrowLeft, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotes } from '../../contexts/NotesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import SyncStatusIndicator from '@/components/SyncStatusIndicator';
import MobileSidebar from './MobileSidebar';

interface DynamicMobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
}

const DynamicMobileHeader: React.FC<DynamicMobileHeaderProps> = ({
  title,
  showSearch = false,
  showBack = false,
  onBack,
  rightActions
}) => {
  const { syncStatus, filters, setFilters } = useNotes();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getContextualTitle = () => {
    if (title) return title;
    
    switch (location.pathname) {
      case '/mobile/notes':
        return 'Notes';
      case '/mobile/editor':
        return 'Write';
      case '/mobile/settings':
        return 'Settings';
      default:
        return 'NoteAI Suite';
    }
  };

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setFilters({ ...filters, searchTerm: '' });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <header className="bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3 flex-1">
            {showBack ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            {isSearchActive && showSearch ? (
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Search notes..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="h-8 text-sm"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 flex-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs">
                    {user?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {getContextualTitle()}
                </h1>
                <SyncStatusIndicator status={syncStatus} className="text-xs" />
              </div>
            )}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleSearchToggle}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            
            {rightActions || (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <MobileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default DynamicMobileHeader;
