import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarEventForm } from '../components/Calendar/CalendarEventForm';
import { CalendarEvent } from '../types/calendar';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useNotes } from '../contexts/NotesContext';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { notes, createNote, setCurrentNote } = useNotes();
  const navigate = useNavigate();

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => isSameDay(new Date(note.createdAt), date));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const selectedDateNotes = getNotesForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setViewDate(newDate);
  };

  const handleEventSubmit = (eventData: Omit<CalendarEvent, 'id'>) => {
    addEvent(eventData);
    setIsEventFormOpen(false);
  };

  const handleNoteSubmit = async (noteData: { title: string; content: string }) => {
    await createNote({
      title: noteData.title,
      content: noteData.content,
      category: 'general',
      tags: [],
      isFavorite: false,
      color: '#64748b'
    });
    setIsNoteFormOpen(false);
  };

  const handleNoteClick = (note: any) => {
    console.log('Note clicked:', note);
    setCurrentNote(note);
    navigate('/app/editor');
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-3 h-3" />;
      case 'note':
        return <FileText className="w-3 h-3" />;
      default:
        return <CalendarIcon className="w-3 h-3" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'note':
        return 'bg-green-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsEventFormOpen(!isEventFormOpen)}
            className="gap-2"
            variant={isEventFormOpen ? "secondary" : "default"}
          >
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
          
          <Button 
            onClick={() => setIsNoteFormOpen(!isNoteFormOpen)}
            variant={isNoteFormOpen ? "secondary" : "outline"} 
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold">
                {format(viewDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
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
                      onClick={() => setSelectedDate(day)}
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
                              handleNoteClick(note);
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
                            setSelectedDate(day);
                            setIsEventFormOpen(true);
                          }}
                          className="p-1 rounded bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
                          title="Add Event"
                        >
                          <CalendarIcon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(day);
                            setIsNoteFormOpen(true);
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
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {format(selectedDate, 'EEEE, MMM d')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="events" className="space-y-3 mt-4">
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No events for this date</p>
                  ) : (
                    selectedDateEvents.map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.type)}
                          <span className="font-medium">{event.title}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {event.type}
                          </Badge>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-3 mt-4">
                  {selectedDateNotes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No notes for this date</p>
                  ) : (
                    selectedDateNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => handleNoteClick(note)}
                        className="w-full p-3 border rounded-lg space-y-2 text-left hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{note.title}</span>
                          <Badge variant="outline" className="ml-auto">
                            {note.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {note.content}
                        </p>
                        <div className="flex gap-1">
                          {note.tags.map((tag) => (
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
        </div>
      </div>

      {/* Inline Event Creation Form */}
      {isEventFormOpen && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Create New Event</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEventFormOpen(false)}
              >
                Cancel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarEventForm onSubmit={handleEventSubmit} />
          </CardContent>
        </Card>
      )}

      {/* Inline Note Creation Form */}
      {isNoteFormOpen && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Create New Note</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsNoteFormOpen(false)}
              >
                Cancel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="note-title" className="text-sm font-medium">Title</label>
                <input
                  id="note-title"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter note title"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const title = e.currentTarget.value;
                      const content = document.getElementById('note-content') as HTMLTextAreaElement;
                      if (title.trim()) {
                        handleNoteSubmit({ title, content: content?.value || '' });
                      }
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="note-content" className="text-sm font-medium">Content</label>
                <textarea
                  id="note-content"
                  className="w-full px-3 py-2 border rounded-md h-32"
                  placeholder="Enter note content"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    const title = (document.getElementById('note-title') as HTMLInputElement).value;
                    const content = (document.getElementById('note-content') as HTMLTextAreaElement).value;
                    if (title.trim()) {
                      handleNoteSubmit({ title, content });
                    }
                  }}
                  className="flex-1"
                >
                  Create Note
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsNoteFormOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Calendar;
