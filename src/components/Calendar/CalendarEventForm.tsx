import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CreateCalendarEventData } from '../../types/calendar';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start_date: z.date({
    required_error: 'Date is required',
  }),
  end_date: z.date().optional(),
  is_all_day: z.boolean().default(false),
  location: z.string().optional(),
  reminder_minutes: z.number().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface CalendarEventFormProps {
  onSubmit: (data: CreateCalendarEventData) => void;
  initialData?: Partial<CreateCalendarEventData>;
}

export const CalendarEventForm: React.FC<CalendarEventFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      end_date: initialData?.end_date ? new Date(initialData.end_date) : undefined,
      is_all_day: initialData?.is_all_day || false,
      location: initialData?.location || '',
      reminder_minutes: initialData?.reminder_minutes || undefined,
    },
  });

  const selectedStartDate = watch('start_date');
  const selectedEndDate = watch('end_date');
  const isAllDay = watch('is_all_day');

  const handleFormSubmit = (data: EventFormData) => {
    const eventData: CreateCalendarEventData = {
      title: data.title,
      description: data.description,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date?.toISOString(),
      is_all_day: data.is_all_day,
      location: data.location,
      reminder_minutes: data.reminder_minutes,
    };
    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter event title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter event description (optional)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="Enter event location (optional)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_all_day"
          checked={isAllDay}
          onCheckedChange={(checked) => setValue('is_all_day', checked as boolean)}
        />
        <Label htmlFor="is_all_day">All day event</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !selectedStartDate && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedStartDate ? format(selectedStartDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedStartDate}
                onSelect={(date) => date && setValue('start_date', date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.start_date && (
            <p className="text-sm text-destructive">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>End Date (optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !selectedEndDate && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedEndDate ? format(selectedEndDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedEndDate}
                onSelect={(date) => setValue('end_date', date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {!isAllDay && (
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="time"
              type="time"
              className="pl-10"
              onChange={(e) => {
                if (e.target.value && selectedStartDate) {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(selectedStartDate);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  setValue('start_date', newDate);
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="reminder">Reminder (minutes before)</Label>
        <Input
          id="reminder"
          type="number"
          {...register('reminder_minutes', { valueAsNumber: true })}
          placeholder="15"
          min="0"
        />
      </div>

      <Button type="submit" className="w-full">
        Create Event
      </Button>
    </form>
  );
};