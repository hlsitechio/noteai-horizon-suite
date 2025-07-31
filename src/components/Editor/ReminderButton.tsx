
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellRing } from 'lucide-react';
import ReminderDialog from './ReminderDialog';
import { Note } from '../../types/note';

interface ReminderButtonProps {
  note: Note | null;
  isVisible: boolean;
}

const ReminderButton: React.FC<ReminderButtonProps> = ({ note, isVisible }) => {
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  if (!isVisible || !note) {
    return null;
  }

  const hasReminder = note.reminder_enabled && note.reminder_status === 'pending';

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowReminderDialog(true)}
        className={`flex items-center gap-2 ${
          hasReminder 
            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
            : 'hover:bg-muted'
        }`}
      >
        {hasReminder ? (
          <BellRing className="w-4 h-4" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
        {hasReminder ? 'Reminder Set' : 'Add Reminder'}
      </Button>

      <ReminderDialog
        isOpen={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
        noteId={note.id}
        noteTitle={note.title}
      />
    </>
  );
};

export default ReminderButton;
