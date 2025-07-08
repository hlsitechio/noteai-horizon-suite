-- Fix dashboard_settings table schema
DO $$ 
BEGIN
  -- Add missing columns to dashboard_settings table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dashboard_settings' AND column_name = 'dashboard_edit_mode') THEN
    ALTER TABLE public.dashboard_settings 
    ADD COLUMN dashboard_edit_mode boolean DEFAULT false,
    ADD COLUMN sidebar_edit_mode boolean DEFAULT false,
    ADD COLUMN edit_mode_expires_at timestamp with time zone,
    ADD COLUMN sidebar_panel_sizes jsonb DEFAULT '{}',
    ADD COLUMN selected_banner_url text,
    ADD COLUMN selected_banner_type text;
  END IF;
END $$;