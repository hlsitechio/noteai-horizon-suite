
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Bell } from 'lucide-react';
import { ReminderService } from '../../services/reminderService';
import { toast } from 'sonner';

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteTitle: string;
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({
  isOpen,
  onClose,
  noteId,
  noteTitle
}) => {
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateReminder = async () => {
    if (!reminderDate || !reminderTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsCreating(true);
    try {
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
      
      if (reminderDateTime <= new Date()) {
        toast.error('Reminder time must be in the future');
        return;
      }

      const reminder = await ReminderService.createReminder(noteId, reminderDateTime, frequency);
      
      if (reminder) {
        toast.success('Reminder created successfully!');
        onClose();
      } else {
        toast.error('Failed to create reminder');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  // Set default values when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const defaultTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      
      setReminderDate(formatDate(defaultTime));
      setReminderTime(formatTime(defaultTime));
      setFrequency('once');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Set Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Note</Label>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {noteTitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                min={formatDate(new Date())}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateReminder}
            disabled={isCreating}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isCreating ? 'Creating...' : 'Create Reminder'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
