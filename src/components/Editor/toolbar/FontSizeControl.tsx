
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { PencilIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface FontSizeControlProps {
  fontSize: number;
  onChange: (fontSize: number) => void;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ fontSize, onChange }) => {
  const handleSliderChange = (value: number[]) => {
    onChange(value[0]);
  };

  const handleIncrement = () => {
    onChange(Math.min(72, fontSize + 1));
  };

  const handleDecrement = () => {
    onChange(Math.max(8, fontSize - 1));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs hover:bg-orange-100 dark:hover:bg-slate-600"
          title="Font Size"
        >
          <PencilIcon className="w-3 h-3 mr-1" />
          {fontSize}px
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3 dark:bg-slate-800 dark:border-slate-600">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium dark:text-slate-200">Font Size</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">{fontSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecrement}
              className="h-6 w-6 p-0"
            >
              <MinusIcon className="w-3 h-3" />
            </Button>
            <Slider
              value={[fontSize]}
              onValueChange={handleSliderChange}
              max={72}
              min={8}
              step={1}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleIncrement}
              className="h-6 w-6 p-0"
            >
              <PlusIcon className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FontSizeControl;
