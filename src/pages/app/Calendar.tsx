import React, { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { Plus, Users, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarGrid } from '@/components/Calendar/CalendarGrid';
import { CalendarEventFormInline } from '@/components/Calendar/CalendarEventFormInline';
import { CalendarDateDetails } from '@/components/Calendar/CalendarDateDetails';
import { CalendarNoteFormInline } from '@/components/Calendar/CalendarNoteFormInline';
import { CalendarTaskCreator } from '@/components/Calendar/CalendarTaskCreator';
import { CalendarEvent, CreateCalendarEventData } from '@/types/calendar';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useTasks } from '@/hooks/useTasks';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [isTaskCreatorOpen, setIsTaskCreatorOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    events,
    loading,
    addEvent
  } = useCalendarEvents();
  const {
    notes,
    createNote,
    setCurrentNote
  } = useOptimizedNotes();
  const { createTask } = useTasks();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Check if we should open task creator from URL params
  useEffect(() => {
    if (searchParams.get('createTask') === 'true') {
      setIsTaskCreatorOpen(true);
      // Remove the parameter from URL without navigation
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('createTask');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.start_date), date));
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
  const handleEventSubmit = async (eventData: CreateCalendarEventData) => {
    await addEvent(eventData);
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

  const handleTaskSubmit = async (taskData: any) => {
    // Create the task in Supabase
    const newTask = await createTask({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      due_date: taskData.dueDate,
      category: taskData.category
    });

    if (newTask) {
      // Also create a calendar event for the task
      const taskEvent: CreateCalendarEventData = {
        title: `Task: ${taskData.title}`,
        description: taskData.description || `${taskData.category} - Priority: ${taskData.priority}`,
        start_date: taskData.dueDate,
        is_all_day: true
      };
      
      await addEvent(taskEvent);
      
      // Update the view to show the month containing the task's due date
      const taskDate = new Date(taskData.dueDate);
      setViewDate(taskDate);
    }
    
    setIsTaskCreatorOpen(false);
  };
  const getEventTypeIcon = () => {
    return <CalendarIcon className="w-3 h-3" />;
  };

  // Enhanced function to determine if an event is a task
  const isTaskEvent = (event: CalendarEvent) => {
    return event.title.startsWith('Task:');
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

          <Button onClick={() => setIsTaskCreatorOpen(!isTaskCreatorOpen)} variant={isTaskCreatorOpen ? "secondary" : "outline"} className="gap-2" size={isMobile ? "default" : "default"}>
            <Plus className="w-4 h-4" />
            Add Task
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

          {/* Task Creator */}
          <CalendarTaskCreator isOpen={isTaskCreatorOpen} onClose={() => setIsTaskCreatorOpen(false)} onSubmit={handleTaskSubmit} selectedDate={selectedDate} />

          <CalendarDateDetails selectedDate={selectedDate} events={selectedDateEvents} notes={selectedDateNotes} onNoteClick={handleNoteClick} getEventTypeIcon={getEventTypeIcon} />
        </div>
      </div>

      {/* Inline Note Creation Form */}
      <CalendarNoteFormInline isOpen={isNoteFormOpen} onClose={() => setIsNoteFormOpen(false)} onSubmit={handleNoteSubmit} />
    </div>;
};
export default Calendar;