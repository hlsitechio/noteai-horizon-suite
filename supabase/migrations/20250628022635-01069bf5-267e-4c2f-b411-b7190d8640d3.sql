
-- Add notification preferences to user profiles
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  phone_number TEXT,
  email_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notification preferences" 
  ON public.notification_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" 
  ON public.notification_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" 
  ON public.notification_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to get user notification preferences
CREATE OR REPLACE FUNCTION public.get_user_notification_preferences(user_uuid uuid)
RETURNS TABLE (
  email_notifications boolean,
  sms_notifications boolean,
  phone_number text,
  email_address text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT 
    COALESCE(np.email_notifications, true) as email_notifications,
    COALESCE(np.sms_notifications, false) as sms_notifications,
    np.phone_number,
    COALESCE(np.email_address, au.email) as email_address
  FROM auth.users au
  LEFT JOIN notification_preferences np ON np.user_id = au.id
  WHERE au.id = user_uuid;
$$;

-- Update the get_pending_reminders function to include notification preferences
CREATE OR REPLACE FUNCTION public.get_pending_reminders_with_preferences(user_uuid uuid)
RETURNS TABLE (
  reminder_id uuid,
  note_id uuid,
  note_title text,
  reminder_date timestamp with time zone,
  email_notifications boolean,
  sms_notifications boolean,
  phone_number text,
  email_address text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as reminder_id,
    n.id as note_id,
    n.title as note_title,
    r.reminder_date,
    COALESCE(np.email_notifications, true) as email_notifications,
    COALESCE(np.sms_notifications, false) as sms_notifications,
    np.phone_number,
    COALESCE(np.email_address, au.email) as email_address
  FROM reminders r
  JOIN notes_v2 n ON n.id = r.note_id
  JOIN auth.users au ON au.id = r.user_id
  LEFT JOIN notification_preferences np ON np.user_id = r.user_id
  WHERE r.user_id = user_uuid 
    AND r.status = 'pending' 
    AND r.reminder_date <= now()
    AND (r.snooze_until IS NULL OR r.snooze_until <= now());
END;
$$;
