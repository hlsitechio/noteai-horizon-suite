
-- Check if the user exists in auth.users but not in user_profiles
DO $$
DECLARE
    user_exists_in_auth boolean;
    user_exists_in_profiles boolean;
    admin_user_id uuid := '49df65ae-334d-4ee4-844f-77029c381f56'::uuid;
    admin_email text := 'hlarosesurprenant@gmail.com';
BEGIN
    -- Check if user exists in auth.users (we can't query this directly but we'll assume they do)
    -- Check if user exists in user_profiles
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE id = admin_user_id) INTO user_exists_in_profiles;
    
    -- If user doesn't exist in profiles, create the profile
    IF NOT user_exists_in_profiles THEN
        INSERT INTO public.user_profiles (id, email, display_name)
        VALUES (admin_user_id, admin_email, admin_email)
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            display_name = COALESCE(user_profiles.display_name, EXCLUDED.display_name);
        
        RAISE NOTICE 'Created/updated user profile for %', admin_email;
    END IF;
    
    -- Ensure user settings exist
    INSERT INTO public.user_settings (user_id)
    VALUES (admin_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Ensure admin role is assigned
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Ensured admin setup is complete for %', admin_email;
END $$;
