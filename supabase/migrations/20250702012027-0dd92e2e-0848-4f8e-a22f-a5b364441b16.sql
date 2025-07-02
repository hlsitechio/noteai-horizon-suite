-- Drop the existing view and recreate it properly
DROP VIEW IF EXISTS public.daily_visit_counts;

CREATE VIEW public.daily_visit_counts WITH (security_invoker = on) AS
SELECT 
  page_path,
  DATE(visited_at) as visit_date,
  COUNT(*) as visit_count
FROM public.page_visits
GROUP BY page_path, DATE(visited_at)
ORDER BY visit_date DESC, visit_count DESC;