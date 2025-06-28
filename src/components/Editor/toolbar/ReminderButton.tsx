
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReminderDialog from '../ReminderDialog';
import { Note } from '../../../types/note';
import { formatDistanceToNow } from 'date-fns';

interface ReminderButtonProps {
  note: Note | null;
  onReminderSet?: () => void;
}

const ReminderButton: React.FC<ReminderButtonProps> = ({ note, onReminderSet }) => {
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  if (!note) {
    return null;
  }

  const hasReminder = note.reminder_enabled && note.reminder_status === 'pending';
  const reminderDate = note.reminder_date ? new Date(note.reminder_date) : null;

  const formatReminderTime = (date: Date) => {
    const now = new Date();
    if (date < now) {
      return 'Overdue';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleDialogClose = () => {
    setShowReminderDialog(false);
    if (onReminderSet) {
      onReminderSet();
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant={hasReminder ? "default" : "outline"}
          size="sm"
          onClick={() => setShowReminderDialog(true)}
          className={`flex items-center gap-2 ${
            hasReminder 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
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

        {hasReminder && reminderDate && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatReminderTime(reminderDate)}
          </Badge>
        )}
      </div>

      <ReminderDialog
        isOpen={showReminderDialog}
        onClose={handleDialogClose}
        noteId={note.id}
        noteTitle={note.title}
      />
    </>
  );
};

export default ReminderButton;
