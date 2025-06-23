
-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;

-- Enable RLS on tables (safe to run even if already enabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin users can view all roles
CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert user profile only if it doesn't exist
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert user settings only if it doesn't exist
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Assign admin role if this is your email
  IF NEW.email = 'hlarosesurprenant@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Assign user role for all other users
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
