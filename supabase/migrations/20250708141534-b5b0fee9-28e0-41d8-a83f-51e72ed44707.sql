-- Add missing indexes for foreign keys to improve query performance

-- Index for folders.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);

-- Index for notes_v2.user_id foreign key  
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_id ON public.notes_v2(user_id);

-- Index for notes_v2.folder_id foreign key
CREATE INDEX IF NOT EXISTS idx_notes_v2_folder_id ON public.notes_v2(folder_id);

-- Drop the unused index on folders.parent_folder_id
DROP INDEX IF EXISTS idx_folders_parent_folder_id;

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_updated ON public.notes_v2(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_folders_user_name ON public.folders(user_id, name);