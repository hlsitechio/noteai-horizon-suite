
import React from 'react';
import { Bold, Italic, List, Hash, Camera, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileEditorToolbar: React.FC = () => {
  const toolbarItems = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: List, label: 'List' },
    { icon: Hash, label: 'Heading' },
    { icon: Camera, label: 'Photo' },
    { icon: Mic, label: 'Voice' },
  ];

  return (
    <div className="border-t border-border p-3 flex-shrink-0">
      <div className="flex justify-around">
        {toolbarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className="h-10 w-12 p-0"
            >
              <Icon className="w-5 h-5" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileEditorToolbar;
