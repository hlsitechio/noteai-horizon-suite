import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarEvent } from '../../types/calendar';

interface CalendarDateDetailsProps {
  selectedDate: Date;
  events: CalendarEvent[];
  notes: any[];
  onNoteClick: (note: any) => void;
  getEventTypeIcon: (type: CalendarEvent['type']) => React.ReactNode;
}

export const CalendarDateDetails: React.FC<CalendarDateDetailsProps> = ({
  selectedDate,
  events,
  notes,
  onNoteClick,
  getEventTypeIcon,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarIcon className="w-4 h-4" />
          {format(selectedDate, 'EEEE, MMM d')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-2 mt-3">
            {events.length === 0 ? (
              <p className="text-xs text-muted-foreground">No events for this date</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="p-2 border rounded-lg space-y-1.5 bg-accent/5">
                  <div className="flex items-center gap-2">
                    {getEventTypeIcon(event.type)}
                    <span className="font-medium text-sm">{event.title}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {event.type}
                    </Badge>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  )}
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-2 mt-3">
            {notes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notes for this date</p>
            ) : (
              notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => onNoteClick(note)}
                  className="w-full p-2 border rounded-lg space-y-1.5 text-left hover:bg-accent/10 transition-colors bg-accent/5"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span className="font-medium text-sm">{note.title}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {note.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex gap-1">
                    {note.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};