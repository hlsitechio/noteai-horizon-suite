-- Recreate the daily_visit_counts view with proper source table
CREATE OR REPLACE VIEW public.daily_visit_counts WITH (security_invoker = on) AS
SELECT 
  page_path,
  DATE(visited_at) as visit_date,
  COUNT(*) as visit_count
FROM public.page_visits
GROUP BY page_path, DATE(visited_at)
ORDER BY visit_date DESC, visit_count DESC;