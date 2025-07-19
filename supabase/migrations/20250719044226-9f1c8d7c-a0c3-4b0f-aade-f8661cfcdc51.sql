-- Add performance indexes for production scale (Part 2)
-- Note: These indexes are created without CONCURRENTLY since it requires transaction block

-- Performance indexes for high-traffic queries
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_search 
ON public.notes_v2(user_id, title) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dashboard_components_user_layout 
ON public.dashboard_components(user_id, layout_id, position_x, position_y) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_seo_visitor_analytics_user_date 
ON public.seo_visitor_analytics(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_kanban_tasks_board_position 
ON public.kanban_tasks(board_id, position) 
WHERE board_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_type_date 
ON public.security_audit_logs(user_id, event_type, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Additional indexes for rate limiting performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint_window 
ON public.rate_limits(user_id, endpoint, window_start DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint_window 
ON public.rate_limits(ip_address, endpoint, window_start DESC) 
WHERE ip_address IS NOT NULL;

-- Index for metrics queries
CREATE INDEX IF NOT EXISTS idx_app_metrics_user_name_time 
ON public.app_metrics(user_id, metric_name, timestamp DESC) 
WHERE user_id IS NOT NULL;

-- Add composite indexes for common dashboard queries
CREATE INDEX IF NOT EXISTS idx_notes_v2_user_folder_updated 
ON public.notes_v2(user_id, folder_id, updated_at DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_kanban_boards_user_updated 
ON public.kanban_boards(user_id, updated_at DESC) 
WHERE user_id IS NOT NULL;

-- Add indexes for APM tables
CREATE INDEX IF NOT EXISTS idx_apm_error_logs_user_time 
ON public.apm_error_logs(user_id, timestamp DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_apm_performance_metrics_user_name_time 
ON public.apm_performance_metrics(user_id, metric_name, timestamp DESC) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_apm_alerts_user_severity_time 
ON public.apm_alerts(user_id, severity, created_at DESC) 
WHERE user_id IS NOT NULL;