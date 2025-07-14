-- Fix the data structure in dashboard_layouts where components is stored as array instead of object
UPDATE dashboard_layouts 
SET layout_config = jsonb_set(
  layout_config, 
  '{components}', 
  '{}', 
  true
) 
WHERE jsonb_typeof(layout_config->'components') = 'array';