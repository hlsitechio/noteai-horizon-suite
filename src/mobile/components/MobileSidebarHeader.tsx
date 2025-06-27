
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MobileSidebarHeaderProps {
  onClose: () => void;
}

const MobileSidebarHeader: React.FC<MobileSidebarHeaderProps> = ({ onClose }) => {
  return (
    <SheetHeader className="p-4 border-b flex-shrink-0">
      <SheetTitle className="flex items-center justify-between">
        <span>Menu</span>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </SheetTitle>
    </SheetHeader>
  );
};

export default MobileSidebarHeader;
