
import React from 'react';
import { 
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  FileText, 
  FolderOpen,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function CollapsedNotesSection() {
  return (
    <div className="px-2 space-y-1">
      <SidebarMenuButton asChild tooltip="Notes">
        <Link to="/app/notes" className="hover:bg-accent hover:text-accent-foreground">
          <FileText className="h-4 w-4" />
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton asChild tooltip="Projects">
        <Link to="/app/projects" className="hover:bg-accent hover:text-accent-foreground">
          <FolderOpen className="h-4 w-4" />
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton asChild tooltip="Favorites">
        <button onClick={() => {}} className="hover:bg-accent hover:text-accent-foreground">
          <Star className="h-4 w-4" />
        </button>
      </SidebarMenuButton>
    </div>
  );
}
