
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ResetZoneButtonProps {
  onReset: () => void;
}

const ResetZoneButton: React.FC<ResetZoneButtonProps> = ({ onReset }) => {
  return (
    <Button
      onClick={onReset}
      variant="outline"
      size="sm"
      className="bg-background/80 hover:bg-background shadow-sm border border-border/50 hover:border-border transition-all duration-200"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Reset Layout
    </Button>
  );
};

export default ResetZoneButton;
