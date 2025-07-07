-- Insert all dashboard components for the layout system

-- Quick Actions components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('quick-actions', 'Quick Actions', 'Quick action buttons for common tasks', 'actions', true, '{}');

-- Recent Activity components  
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('recent-activity', 'Recent Activity', 'Shows recent user activities and updates', 'activity', true, '{}');

-- Analytics Overview components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('analytics-overview', 'Analytics Overview', 'Analytics and metrics overview', 'analytics', true, '{}');

-- Calendar Widget components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('calendar-widget', 'Calendar Widget', 'Mini calendar with upcoming events', 'calendar', true, '{}');

-- Notes Summary components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('notes-summary', 'Notes Summary', 'Summary of notes and documents', 'content', true, '{}');

-- Task List components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('task-list', 'Task List', 'Personal task and todo management', 'productivity', true, '{}');

-- System Status components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('system-status', 'System Status', 'System health and status indicators', 'system', true, '{}');

-- Weather Widget components
INSERT INTO public.dashboard_components (component_key, component_name, component_description, category, is_active, default_props) VALUES
('weather-widget', 'Weather Widget', 'Current weather information', 'widgets', true, '{}');