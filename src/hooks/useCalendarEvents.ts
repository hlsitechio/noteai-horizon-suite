
import { useState, useEffect } from 'react';
import { CalendarEvent, CreateCalendarEventData } from '../types/calendar';
import { CalendarEventsService } from '../services/calendarEventsService';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const savedEvents = await CalendarEventsService.getAllEvents();
        setEvents(savedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const addEvent = async (eventData: CreateCalendarEventData) => {
    const newEvent = await CalendarEventsService.createEvent(eventData);
    if (newEvent) {
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    }
    return null;
  };

  const updateEvent = async (id: string, updates: Partial<CreateCalendarEventData>) => {
    const updatedEvent = await CalendarEventsService.updateEvent(id, updates);
    if (updatedEvent) {
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      return updatedEvent;
    }
    return null;
  };

  const deleteEvent = async (id: string) => {
    const deleted = await CalendarEventsService.deleteEvent(id);
    if (deleted) {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
    return deleted;
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
