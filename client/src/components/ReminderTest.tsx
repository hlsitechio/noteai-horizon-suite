import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReminderService } from '@/services/reminderService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Bell, TestTube } from 'lucide-react';

export const ReminderTest: React.FC = () => {
  const { user } = useAuth();
  const [testReminderDate, setTestReminderDate] = useState('');
  const [testReminderTime, setTestReminderTime] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createTestReminder = async () => {
    if (!user) {
      toast.error('Please log in to test reminders');
      return;
    }

    if (!testReminderDate || !testReminderTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsCreating(true);
    try {
      // First create a test note
      const { data: note, error: noteError } = await supabase
        .from('notes_v2')
        .insert({
          user_id: user.id,
          title: 'Test Reminder Note',
          content: 'This is a test note created for reminder testing.',
          category: 'test'
        })
        .select()
        .single();

      if (noteError || !note) {
        throw new Error('Failed to create test note');
      }

      // Create reminder for the test note
      const reminderDateTime = new Date(`${testReminderDate}T${testReminderTime}`);
      const reminder = await ReminderService.createReminder(note.id, reminderDateTime, 'once');

      if (reminder) {
        toast.success(`Test reminder created for ${reminderDateTime.toLocaleString()}`);
      } else {
        toast.error('Failed to create test reminder');
      }
    } catch (error: any) {
      console.error('Error creating test reminder:', error);
      toast.error(`Failed to create test reminder: ${error.message}`);
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

  // Set default values (5 minutes from now)
  React.useEffect(() => {
    const now = new Date();
    const defaultTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    
    setTestReminderDate(formatDate(defaultTime));
    setTestReminderTime(formatTime(defaultTime));
  }, []);

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Reminder Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to test the reminder system.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Reminder Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="test-date">Date</Label>
            <Input
              id="test-date"
              type="date"
              value={testReminderDate}
              onChange={(e) => setTestReminderDate(e.target.value)}
              min={formatDate(new Date())}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-time">Time</Label>
            <Input
              id="test-time"
              type="time"
              value={testReminderTime}
              onChange={(e) => setTestReminderTime(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={createTestReminder}
          disabled={isCreating}
          className="w-full"
        >
          <Bell className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating Test Reminder...' : 'Create Test Reminder'}
        </Button>

        <p className="text-xs text-muted-foreground">
          This will create a test note with a reminder. The reminder system checks every 5 minutes for due reminders.
        </p>
      </CardContent>
    </Card>
  );
};