
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FolderOpen,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function CollapsedNotesSection() {
  return (
    <div className="px-2 space-y-1">
      <Button variant="ghost" size="sm" asChild className="w-full justify-center">
        <Link to="/app/explorer" className="hover:bg-accent hover:text-accent-foreground">
          <FileText className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="w-full justify-center">
        <Link to="/app/projects" className="hover:bg-accent hover:text-accent-foreground">
          <FolderOpen className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="sm" className="w-full justify-center hover:bg-accent hover:text-accent-foreground">
        <Star className="h-4 w-4" />
      </Button>
    </div>
  );
}
