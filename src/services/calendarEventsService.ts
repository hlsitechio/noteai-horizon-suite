import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  is_all_day?: boolean;
  reminder_minutes?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_all_day?: boolean;
  reminder_minutes?: number;
}

export class CalendarEventsService {
  /**
   * Get all user events
   */
  static async getAllEvents(): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading calendar events:', error);
      return [];
    }
  }

  /**
   * Create a new event
   */
  static async createEvent(eventData: CreateEventData): Promise<CalendarEvent | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          ...eventData,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      const { ActivityService } = await import('./activityService');
      await ActivityService.logActivity({
        activity_type: 'event_created',
        activity_title: `Created event "${eventData.title}"`,
        activity_description: `Event scheduled for ${new Date(eventData.start_date).toLocaleDateString()}`,
        entity_type: 'event',
        entity_id: data.id,
        metadata: {
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          location: eventData.location,
          is_all_day: eventData.is_all_day
        }
      });

      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  /**
   * Update an existing event
   */
  static async updateEvent(id: string, updates: Partial<CreateEventData>): Promise<CalendarEvent | null> {
    try {
      // Get original event for comparison
      const originalEvent = await this.getEventById(id);
      if (!originalEvent) return null;

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      const { ActivityService } = await import('./activityService');
      await ActivityService.logActivity({
        activity_type: 'event_updated',
        activity_title: `Updated event "${updates.title || originalEvent.title}"`,
        activity_description: `Event details modified`,
        entity_type: 'event',
        entity_id: id,
        metadata: {
          changes: Object.keys(updates),
          original_title: originalEvent.title
        }
      });

      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  /**
   * Delete an event
   */
  static async deleteEvent(id: string): Promise<boolean> {
    try {
      // Get event details before deletion for activity logging
      const event = await this.getEventById(id);
      if (!event) return false;

      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log deletion activity
      const { ActivityService } = await import('./activityService');
      await ActivityService.logActivity({
        activity_type: 'event_deleted',
        activity_title: `Deleted event "${event.title}"`,
        activity_description: `Event was scheduled for ${new Date(event.start_date).toLocaleDateString()}`,
        entity_type: 'event',
        entity_id: id,
        metadata: {
          title: event.title,
          start_date: event.start_date,
          end_date: event.end_date,
          location: event.location
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  /**
   * Get event by ID
   */
  static async getEventById(id: string): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  }

  /**
   * Get events for a specific date range
   */
  static async getEventsByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_date', startDate)
        .lte('start_date', endDate)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting events by date range:', error);
      return [];
    }
  }
}