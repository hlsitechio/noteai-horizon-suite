
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon } from '@heroicons/react/24/outline';

interface FontFamilySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FontFamilySelector: React.FC<FontFamilySelectorProps> = ({ value, onChange }) => {
  const fontFamilies = [
    { value: 'inter', label: 'Inter' },
    { value: 'arial', label: 'Arial' },
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'times', label: 'Times New Roman' },
    { value: 'courier', label: 'Courier New' },
    { value: 'verdana', label: 'Verdana' },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[130px] h-8 text-xs">
        <PencilIcon className="w-3 h-3 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {fontFamilies.map(({ value, label }) => (
          <SelectItem key={value} value={value} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FontFamilySelector;
