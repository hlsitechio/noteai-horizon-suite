-- Insert dashboard components with conflict handling

INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('quick-actions', 'Quick Actions', 'Quick action buttons for common tasks', 'actions', true, '{}'),
('recent-activity', 'Recent Activity', 'Shows recent user activities and updates', 'activity', true, '{}'),
('analytics-overview', 'Analytics Overview', 'Analytics and metrics overview', 'analytics', true, '{}'),
('calendar-widget', 'Calendar Widget', 'Mini calendar with upcoming events', 'calendar', true, '{}'),
('notes-summary', 'Notes Summary', 'Summary of notes and documents', 'content', true, '{}'),
('task-list', 'Task List', 'Personal task and todo management', 'productivity', true, '{}'),
('system-status', 'System Status', 'System health and status indicators', 'system', true, '{}'),
('weather-widget', 'Weather Widget', 'Current weather information', 'widgets', true, '{}')
ON CONFLICT (component_key) DO NOTHING;