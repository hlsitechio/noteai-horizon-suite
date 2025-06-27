
-- Add reminder functionality to notes_v2 table
ALTER TABLE public.notes_v2 
ADD COLUMN reminder_date timestamp with time zone,
ADD COLUMN reminder_status text DEFAULT 'none' CHECK (reminder_status IN ('none', 'pending', 'sent', 'dismissed')),
ADD COLUMN reminder_frequency text DEFAULT 'once' CHECK (reminder_frequency IN ('once', 'daily', 'weekly', 'monthly')),
ADD COLUMN reminder_enabled boolean DEFAULT false;

-- Create reminders table for tracking and managing reminders
CREATE TABLE public.reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  note_id uuid NOT NULL REFERENCES public.notes_v2(id) ON DELETE CASCADE,
  reminder_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'dismissed', 'snoozed')),
  frequency text NOT NULL DEFAULT 'once' CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly')),
  snooze_until timestamp with time zone,
  notification_sent boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to reminders table
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reminders
CREATE POLICY "Users can view their own reminders" 
  ON public.reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
  ON public.reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
  ON public.reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
  ON public.reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_reminders_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reminders_updated_at();

-- Create function to get pending reminders for a user
CREATE OR REPLACE FUNCTION public.get_pending_reminders(user_uuid uuid)
RETURNS TABLE(
  reminder_id uuid,
  note_id uuid,
  note_title text,
  reminder_date timestamp with time zone,
  frequency text,
  status text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    r.id as reminder_id,
    r.note_id,
    n.title as note_title,
    r.reminder_date,
    r.frequency,
    r.status
  FROM public.reminders r
  JOIN public.notes_v2 n ON r.note_id = n.id
  WHERE r.user_id = user_uuid
    AND r.status = 'pending'
    AND r.reminder_date <= NOW()
    AND (r.snooze_until IS NULL OR r.snooze_until <= NOW())
  ORDER BY r.reminder_date ASC;
$$;

-- Create function to mark reminder as sent
CREATE OR REPLACE FUNCTION public.mark_reminder_sent(reminder_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.reminders 
  SET 
    status = 'sent',
    notification_sent = true,
    updated_at = NOW()
  WHERE id = reminder_uuid
    AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Create function to snooze reminder
CREATE OR REPLACE FUNCTION public.snooze_reminder(reminder_uuid uuid, snooze_minutes integer DEFAULT 15)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.reminders 
  SET 
    status = 'snoozed',
    snooze_until = NOW() + (snooze_minutes || ' minutes')::interval,
    updated_at = NOW()
  WHERE id = reminder_uuid
    AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;
