-- Insert available dashboard components into the dashboard_components table
INSERT INTO dashboard_components (component_type, component_config, is_enabled, user_id) VALUES
('quick-actions', '{"category": "utilities", "description": "Quick action buttons for common tasks"}', true, '00000000-0000-0000-0000-000000000000'),
('recent-activity', '{"category": "activity", "description": "Display recent user activities and actions"}', true, '00000000-0000-0000-0000-000000000000'),
('analytics-overview', '{"category": "analytics", "description": "Overview of key analytics metrics"}', true, '00000000-0000-0000-0000-000000000000'),
('calendar-widget', '{"category": "productivity", "description": "Calendar view with upcoming events"}', true, '00000000-0000-0000-0000-000000000000'),
('system-status', '{"category": "monitoring", "description": "System health and status indicators"}', true, '00000000-0000-0000-0000-000000000000'),
('notes-summary', '{"category": "productivity", "description": "Summary of recent notes and documents"}', true, '00000000-0000-0000-0000-000000000000'),
('task-list', '{"category": "productivity", "description": "Task management and to-do list"}', true, '00000000-0000-0000-0000-000000000000'),
('weather-widget', '{"category": "information", "description": "Current weather and forecast information"}', true, '00000000-0000-0000-0000-000000000000'),
('stats-card', '{"category": "analytics", "description": "Statistical data display cards"}', true, '00000000-0000-0000-0000-000000000000'),
('social-media', '{"category": "social", "description": "Social media metrics and updates"}', true, '00000000-0000-0000-0000-000000000000'),
('project-card', '{"category": "project", "description": "Project overview and progress tracking"}', true, '00000000-0000-0000-0000-000000000000'),
('performance-card', '{"category": "analytics", "description": "Performance metrics and KPIs"}', true, '00000000-0000-0000-0000-000000000000');

-- Create system user for shared components if it doesn't exist
-- Note: Using a placeholder user_id for system components