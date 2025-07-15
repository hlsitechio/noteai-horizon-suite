import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface BannerSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BannerSettingsModal: React.FC<BannerSettingsModalProps> = ({
  open,
  onOpenChange
}) => {

  const handleSave = async () => {
    // Simple close for now since all settings have been removed
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md"
        onOpenAutoFocus={(e) => {
          // Prevent auto-focus to avoid aria-hidden conflicts
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Banner Settings
          </DialogTitle>
          <DialogDescription>
            Banner configuration settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Banner settings configuration has been simplified.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerSettingsModal;