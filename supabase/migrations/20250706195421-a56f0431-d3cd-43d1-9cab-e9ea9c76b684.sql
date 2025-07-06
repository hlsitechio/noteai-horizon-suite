-- Add edit mode states to dashboard_settings table
ALTER TABLE public.dashboard_settings 
ADD COLUMN dashboard_edit_mode boolean DEFAULT false,
ADD COLUMN sidebar_edit_mode boolean DEFAULT false,
ADD COLUMN edit_mode_expires_at timestamp with time zone;