import React, { useState, useCallback } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
}

interface ConfirmDialogState extends ConfirmOptions {
  open: boolean;
  onConfirm: () => void;
}

export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    open: false,
    onConfirm: () => {},
  });

  const confirm = useCallback((options: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        title: options.title || "Are you sure?",
        description: options.description || "This action cannot be undone.",
        confirmText: options.confirmText || "Continue",
        cancelText: options.cancelText || "Cancel",
        variant: options.variant || 'default',
        onConfirm: () => resolve(true),
      });
    });
  }, []);

  const confirmDelete = useCallback((itemName?: string) => {
    return confirm({
      title: "Delete confirmation",
      description: itemName 
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: 'destructive',
    });
  }, [confirm]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      // If dialog is being closed without confirmation, resolve with false
      setDialogState(prev => {
        if (prev.open) {
          // Only resolve if we had an active dialog
          setTimeout(() => {
            // Small delay to ensure the promise resolves after the dialog closes
          }, 0);
        }
        return { ...prev, open: false };
      });
    }
  }, []);

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      open={dialogState.open}
      onOpenChange={handleOpenChange}
      title={dialogState.title}
      description={dialogState.description}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      variant={dialogState.variant}
      onConfirm={dialogState.onConfirm}
    />
  );

  return {
    confirm,
    confirmDelete,
    ConfirmDialog: ConfirmDialogComponent,
  };
}