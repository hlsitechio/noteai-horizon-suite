
-- Fix the unique constraint issue by cleaning up duplicate records first
-- and then ensuring the constraint works properly

-- First, let's see what duplicates exist and clean them up
-- Keep only the most recent record for each user/banner_type/project_id combination
DELETE FROM public.banners 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, banner_type, COALESCE(project_id, '')) id
  FROM public.banners
  ORDER BY user_id, banner_type, COALESCE(project_id, ''), updated_at DESC
);

-- Drop the existing constraint if it exists
ALTER TABLE public.banners DROP CONSTRAINT IF EXISTS banners_user_id_banner_type_project_id_key;

-- Recreate the unique constraint with proper handling of NULL values
-- For dashboard banners, project_id should be NULL
-- For project banners, project_id should have a value
CREATE UNIQUE INDEX banners_unique_dashboard_idx 
ON public.banners (user_id, banner_type) 
WHERE banner_type = 'dashboard' AND project_id IS NULL;

CREATE UNIQUE INDEX banners_unique_project_idx 
ON public.banners (user_id, banner_type, project_id) 
WHERE banner_type = 'project' AND project_id IS NOT NULL;
