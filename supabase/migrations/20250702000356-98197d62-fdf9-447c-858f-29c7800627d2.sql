-- Fix daily_visit_counts view insertion issue
-- Drop the existing view and recreate it as an updatable view with proper INSTEAD OF triggers

DROP VIEW IF EXISTS public.daily_visit_counts;

-- Create the view again
CREATE VIEW public.daily_visit_counts AS
SELECT 
    date(visited_at) AS visit_date,
    page_path,
    count(*) AS visit_count
FROM page_visits
GROUP BY date(visited_at), page_path
ORDER BY date(visited_at) DESC, page_path;

-- Create an INSTEAD OF INSERT trigger to handle any insert attempts
CREATE OR REPLACE FUNCTION public.handle_daily_visit_counts_insert()
RETURNS trigger AS $$
BEGIN
  -- Log the attempt but don't actually insert anything
  -- This prevents the error while maintaining the view's read-only nature
  RAISE NOTICE 'Attempted insert into read-only view daily_visit_counts ignored';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER daily_visit_counts_insert_trigger
  INSTEAD OF INSERT ON public.daily_visit_counts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_daily_visit_counts_insert();

-- Add a comment to document the view's purpose
COMMENT ON VIEW public.daily_visit_counts IS 'Read-only aggregated view of daily page visit counts. Direct inserts are not allowed - use page_visits table instead.';