-- Create index on parent_folder_id to improve foreign key performance
CREATE INDEX IF NOT EXISTS idx_folders_parent_folder_id ON public.folders (parent_folder_id);