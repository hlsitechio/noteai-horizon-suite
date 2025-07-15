
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

export interface CreateCalendarEventData {
  title: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_all_day?: boolean;
  reminder_minutes?: number;
}

export interface CalendarFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
}
