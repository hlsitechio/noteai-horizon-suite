
-- Update notes_v2 table to add folder relationship if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'notes_v2' 
                AND column_name = 'folder_id') THEN
    ALTER TABLE public.notes_v2 ADD COLUMN folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Create folders table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#64748b',
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on folders table
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can create their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;

-- Create RLS policies for folders
CREATE POLICY "Users can view their own folders" 
  ON public.folders 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own folders" 
  ON public.folders 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own folders" 
  ON public.folders 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own folders" 
  ON public.folders 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Enable RLS on notes_v2 table if not already enabled
ALTER TABLE public.notes_v2 ENABLE ROW LEVEL SECURITY;

-- Handle notes_v2 policies
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes_v2;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes_v2;

CREATE POLICY "Users can view their own notes" 
  ON public.notes_v2 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own notes" 
  ON public.notes_v2 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notes" 
  ON public.notes_v2 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notes" 
  ON public.notes_v2 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Add updated_at trigger for folders
CREATE OR REPLACE FUNCTION public.update_folders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_folders_updated_at ON public.folders;
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_folders_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON public.folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_notes_v2_folder_id ON public.notes_v2(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_id ON public.notes_v2(user_id);
