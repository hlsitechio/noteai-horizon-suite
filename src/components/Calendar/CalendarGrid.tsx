import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '../../types/calendar';

interface CalendarGridProps {
  viewDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  notes: any[];
  onDateSelect: (date: Date) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onAddEvent: (date: Date) => void;
  onAddNote: (date: Date) => void;
  onNoteClick: (note: any) => void;
  getEventTypeIcon: (type: CalendarEvent['type']) => React.ReactNode;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  viewDate,
  selectedDate,
  events,
  notes,
  onDateSelect,
  onNavigateMonth,
  onAddEvent,
  onAddNote,
  onNoteClick,
  getEventTypeIcon,
}) => {
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => isSameDay(new Date(note.createdAt), date));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">
          {format(viewDate, 'MMMM yyyy')}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const dayNotes = getNotesForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, viewDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={`
                  relative p-3 h-32 rounded-lg border transition-all duration-200 flex flex-col
                  ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isToday(day) ? 'bg-accent' : ''}
                `}
              >
                <div className="text-sm font-medium mb-2">
                  {format(day, 'd')}
                </div>
                
                {/* Events section */}
                <div className="flex-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-1 p-1 rounded text-xs bg-white/10 backdrop-blur-sm"
                    >
                      {getEventTypeIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  
                  {/* Notes section */}
                  {dayNotes.slice(0, 1).map((note) => (
                    <button
                      key={note.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteClick(note);
                      }}
                      className="flex items-center gap-1 p-1 rounded text-xs bg-orange-500/20 backdrop-blur-sm hover:bg-orange-500/30 transition-colors w-full text-left"
                    >
                      <FileText className="w-3 h-3" />
                      <span className="truncate">{note.title}</span>
                    </button>
                  ))}
                  
                  {/* Show count if more items */}
                  {(dayEvents.length + dayNotes.length) > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{(dayEvents.length + dayNotes.length) - 3} more
                    </div>
                  )}
                </div>
                
                {/* Quick action buttons */}
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddEvent(day);
                    }}
                    className="p-1 rounded bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
                    title="Add Event"
                  >
                    <CalendarIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNote(day);
                    }}
                    className="p-1 rounded bg-green-500/20 hover:bg-green-500/30 transition-colors"
                    title="Add Note"
                  >
                    <FileText className="w-3 h-3" />
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};