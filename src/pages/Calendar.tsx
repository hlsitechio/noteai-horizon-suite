import React, { useState } from 'react';
import { isSameDay } from 'date-fns';
import { Plus, Users, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarGrid } from '../components/Calendar/CalendarGrid';
import { CalendarEventFormInline } from '../components/Calendar/CalendarEventFormInline';
import { CalendarDateDetails } from '../components/Calendar/CalendarDateDetails';
import { CalendarNoteFormInline } from '../components/Calendar/CalendarNoteFormInline';
import { CalendarEvent } from '../types/calendar';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useNotes } from '../contexts/NotesContext';
const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const {
    events,
    addEvent
  } = useCalendarEvents();
  const {
    notes,
    createNote,
    setCurrentNote
  } = useNotes();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
  const handleNoteSubmit = async (noteData: {
    title: string;
    content: string;
  }) => {
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
    setCurrentNote(note);
    navigate('/app/editor');
  };
  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setIsEventFormOpen(true);
  };
  const handleAddNote = (date: Date) => {
    setSelectedDate(date);
    setIsNoteFormOpen(true);
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
  return <div className={`space-y-6 ${isMobile ? 'p-3' : 'p-6'}`}>
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'}`}>
        
        <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
          <Button onClick={() => setIsEventFormOpen(!isEventFormOpen)} className="gap-2" variant={isEventFormOpen ? "secondary" : "default"} size={isMobile ? "default" : "default"}>
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
          
          <Button onClick={() => setIsNoteFormOpen(!isNoteFormOpen)} variant={isNoteFormOpen ? "secondary" : "outline"} className="gap-2" size={isMobile ? "default" : "default"}>
            <Plus className="w-4 h-4" />
            Add Note
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Calendar Grid */}
        <div className={isMobile ? 'col-span-1' : 'lg:col-span-2'}>
          <CalendarGrid viewDate={viewDate} selectedDate={selectedDate} events={events} notes={notes} onDateSelect={setSelectedDate} onNavigateMonth={navigateMonth} onAddEvent={handleAddEvent} onAddNote={handleAddNote} onNoteClick={handleNoteClick} getEventTypeIcon={getEventTypeIcon} />
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          {/* Create New Event Form */}
          <CalendarEventFormInline isOpen={isEventFormOpen} onClose={() => setIsEventFormOpen(false)} onSubmit={handleEventSubmit} selectedDate={selectedDate} />

          <CalendarDateDetails selectedDate={selectedDate} events={selectedDateEvents} notes={selectedDateNotes} onNoteClick={handleNoteClick} getEventTypeIcon={getEventTypeIcon} />
        </div>
      </div>

      {/* Inline Note Creation Form */}
      <CalendarNoteFormInline isOpen={isNoteFormOpen} onClose={() => setIsNoteFormOpen(false)} onSubmit={handleNoteSubmit} />
    </div>;
};
export default Calendar;