-- Create demo user profile and onboarding data
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'demo@noteai.com',
  '$2a$10$demopasswordhashdemopasswordhash',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create demo user profile
INSERT INTO public.user_profiles (
  id,
  email,
  display_name,
  welcome_message
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@noteai.com',
  'Demo User',
  'Welcome to your NoteAI Suite demo!'
) ON CONFLICT (id) DO NOTHING;

-- Create demo onboarding settings
INSERT INTO public.user_onboarding (
  user_id,
  onboarding_enabled,
  onboarding_completed,
  current_step,
  completed_steps
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  true,
  false,
  0,
  '{}'
) ON CONFLICT (user_id) DO NOTHING;