import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DocumentImport } from './DocumentImport';

interface DocumentImportDialogProps {
  onImportComplete?: () => void;
  children?: React.ReactNode;
}

export const DocumentImportDialog: React.FC<DocumentImportDialogProps> = ({
  onImportComplete,
  children
}) => {
  const [open, setOpen] = useState(false);

  const handleImportComplete = () => {
    setOpen(false);
    if (onImportComplete) {
      onImportComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="ghost">
            <Upload className="w-4 h-4 mr-2" />
            Import Documents
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Documents to Explorer</DialogTitle>
        </DialogHeader>
        <DocumentImport onImportComplete={handleImportComplete} />
      </DialogContent>
    </Dialog>
  );
};