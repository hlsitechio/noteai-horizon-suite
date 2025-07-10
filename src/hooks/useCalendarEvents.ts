
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types/calendar';
import { CalendarEventService } from '../services/calendarEventService';

export const useCalendarEvents = () => {
  console.log('useCalendarEvents hook called', { React });
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const loadEvents = () => {
      const savedEvents = CalendarEventService.getAllEvents();
      setEvents(savedEvents);
    };

    loadEvents();
  }, []);

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent = CalendarEventService.saveEvent(eventData);
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>) => {
    const updatedEvent = CalendarEventService.updateEvent(id, updates);
    if (updatedEvent) {
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      return updatedEvent;
    }
    return null;
  };

  const deleteEvent = (id: string) => {
    const deleted = CalendarEventService.deleteEvent(id);
    if (deleted) {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
    return deleted;
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
