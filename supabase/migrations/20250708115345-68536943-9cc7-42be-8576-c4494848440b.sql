-- Remove the is_public column since no data should be public
ALTER TABLE public.notes_v2 DROP COLUMN IF EXISTS is_public;