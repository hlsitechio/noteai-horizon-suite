-- Add missing index for folders.parent_folder_id foreign key
CREATE INDEX IF NOT EXISTS idx_folders_parent_folder_id ON public.folders(parent_folder_id);

-- Remove unused composite indexes that may not be needed
DROP INDEX IF EXISTS idx_notes_v2_user_updated;
DROP INDEX IF EXISTS idx_folders_user_name;

-- Keep the essential foreign key indexes as they're needed for RLS policies
-- (idx_folders_user_id, idx_notes_v2_user_id, idx_notes_v2_folder_id)