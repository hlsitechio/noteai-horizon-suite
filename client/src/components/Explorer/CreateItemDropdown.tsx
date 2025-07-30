import React, { useState } from 'react';
import { CreateItemDialog } from './CreateItemDialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface CreateItemDropdownProps {
  type: 'note' | 'folder' | 'favorite' | 'event';
  children: React.ReactNode;
}

export const CreateItemDropdown: React.FC<CreateItemDropdownProps> = ({ type, children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <CreateItemDialog 
      type={type} 
      onSuccess={() => setDropdownOpen(false)}
    >
      <div 
        onSelect={(e: any) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </CreateItemDialog>
  );
};