
-- Add missing color column to folders table
ALTER TABLE public.folders ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT '#64748b';

-- Update the updated_at trigger to ensure it works properly
CREATE OR REPLACE FUNCTION public.update_folders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_folders_updated_at ON public.folders;
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_folders_updated_at();
