import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock,
  MapPin,
  Plus
} from 'lucide-react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { format, isToday, isTomorrow, isFuture, parseISO } from 'date-fns';

export function CalendarWidget() {
  const [currentDate] = useState(new Date());
  const navigate = useNavigate();
  const { events, loading } = useCalendarEvents();

  // Filter and format upcoming events
  const upcomingEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return events
      .filter(event => {
        try {
          const eventDate = parseISO(event.start_date);
          return isFuture(eventDate) || isToday(eventDate);
        } catch {
          return false;
        }
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 3)
      .map(event => {
        try {
          const eventDate = parseISO(event.start_date);
          let dateLabel = 'Today';
          
          if (isToday(eventDate)) {
            dateLabel = 'Today';
          } else if (isTomorrow(eventDate)) {
            dateLabel = 'Tomorrow';
          } else {
            dateLabel = format(eventDate, 'MMM dd');
          }

          return {
            id: event.id,
            title: event.title,
            time: event.is_all_day ? 'All day' : format(eventDate, 'HH:mm'),
            date: dateLabel,
            location: event.location || event.description || 'No location',
            type: 'event'
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }, [events]);

  const handleOpenFullCalendar = () => {
    navigate('/app/calendar');
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();

  // Generate calendar days (simplified for widget)
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentDate.getMonth(), 1).getDay();
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Calendar</CardTitle>
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs">
              {upcomingEvents.length} events
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Calendar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium">
              {currentMonth} {currentYear}
            </span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={`header-${index}`} className="text-xs text-muted-foreground p-1">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div 
                key={`day-${index}`} 
                className={`text-xs p-1 rounded ${
                  day === today 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : day 
                      ? 'text-foreground hover:bg-muted cursor-pointer' 
                      : 'text-transparent'
                }`}
              >
                {day || ''}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-2 pt-2 border-t">
          <span className="text-xs font-medium text-muted-foreground">Upcoming Events</span>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Loading events...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map((event) => event && (
                <div key={event.id} className="space-y-1 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground truncate">
                      {event.title || 'Untitled Event'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {event.date || 'No date'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.time || 'No time'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location || 'No location'}</span>
                    </div>
                  </div>
                </div>
              )).filter(Boolean)
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-muted-foreground"
            onClick={handleOpenFullCalendar}
          >
            <CalendarIcon className="h-3 w-3 mr-1" />
            Open Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}