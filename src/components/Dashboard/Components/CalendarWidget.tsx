import React, { useState } from 'react';
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

const upcomingEvents = [
  {
    id: '1',
    title: 'Team Meeting',
    time: '10:00 AM',
    date: 'Today',
    location: 'Conference Room A',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Project Review',
    time: '2:30 PM',
    date: 'Today',
    location: 'Virtual',
    type: 'review'
  },
  {
    id: '3',
    title: 'Client Call',
    time: '9:00 AM',
    date: 'Tomorrow',
    location: 'Phone',
    type: 'call'
  }
];

export function CalendarWidget() {
  const [currentDate] = useState(new Date());
  
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
                key={`day-${day}`} 
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
            {upcomingEvents.map((event) => (
              <div key={event.id} className="space-y-1 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">
                    {event.title}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {event.date}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Open Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}