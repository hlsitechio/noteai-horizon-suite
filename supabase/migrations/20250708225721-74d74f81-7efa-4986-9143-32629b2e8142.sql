-- Create reminders table for tracking and managing reminders
CREATE TABLE IF NOT EXISTS public.reminders (
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

-- Enable Row Level Security (RLS) on reminders table
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
DROP TRIGGER IF EXISTS update_reminders_updated_at ON public.reminders;
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reminders_updated_at();

-- Add reminder functionality to notes_v2 table if columns don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes_v2' AND column_name = 'reminder_date') THEN
    ALTER TABLE public.notes_v2 
    ADD COLUMN reminder_date timestamp with time zone,
    ADD COLUMN reminder_status text DEFAULT 'none' CHECK (reminder_status IN ('none', 'pending', 'sent', 'dismissed')),
    ADD COLUMN reminder_frequency text DEFAULT 'once' CHECK (reminder_frequency IN ('once', 'daily', 'weekly', 'monthly')),
    ADD COLUMN reminder_enabled boolean DEFAULT false;
  END IF;
END $$;