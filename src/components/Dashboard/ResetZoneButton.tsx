
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
      className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white shadow-md border border-gray-200"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Reset Layout
    </Button>
  );
};

export default ResetZoneButton;
