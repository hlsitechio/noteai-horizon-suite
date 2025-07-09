import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '../../types/calendar';

interface CalendarEventFormInlineProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<CalendarEvent, 'id'>) => void;
  selectedDate: Date;
}

export const CalendarEventFormInline: React.FC<CalendarEventFormInlineProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    const title = (document.getElementById('inline-event-title') as HTMLInputElement).value;
    const description = (document.getElementById('inline-event-desc') as HTMLTextAreaElement).value;
    const type = (document.getElementById('inline-event-type') as HTMLSelectElement).value as CalendarEvent['type'];
    const time = (document.getElementById('inline-event-time') as HTMLInputElement).value;

    if (title.trim()) {
      const eventData: Omit<CalendarEvent, 'id'> = {
        title,
        description,
        date: selectedDate.toISOString(),
        time,
        type,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      onSubmit(eventData);
      
      // Clear form
      (document.getElementById('inline-event-title') as HTMLInputElement).value = '';
      (document.getElementById('inline-event-desc') as HTMLTextAreaElement).value = '';
      (document.getElementById('inline-event-time') as HTMLInputElement).value = '';
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            New Event
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="inline-event-title" className="text-xs font-medium text-muted-foreground">Title</label>
            <input
              id="inline-event-title"
              type="text"
              className="w-full px-2 py-1.5 text-sm border rounded-md bg-background/50"
              placeholder="Event title"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="inline-event-desc" className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              id="inline-event-desc"
              className="w-full px-2 py-1.5 text-sm border rounded-md bg-background/50 h-16 resize-none"
              placeholder="Event description"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select id="inline-event-type" className="w-full px-2 py-1.5 text-sm border rounded-md bg-background/50">
                <option value="event">Event</option>
                <option value="meeting">Meeting</option>
                <option value="note">Important Note</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Time</label>
              <input
                id="inline-event-time"
                type="time"
                className="w-full px-2 py-1.5 text-sm border rounded-md bg-background/50"
              />
            </div>
          </div>
          <Button 
            onClick={handleSubmit}
            className="w-full h-8 text-sm"
            size="sm"
          >
            Create Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};