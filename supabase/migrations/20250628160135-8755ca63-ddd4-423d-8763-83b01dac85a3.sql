
-- Check what policies already exist and create only missing ones
DO $$
BEGIN
    -- Enable RLS if not already enabled
    ALTER TABLE public.notes_v2 ENABLE ROW LEVEL SECURITY;
    
    -- Create INSERT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes_v2' 
        AND policyname = 'Users can create their own notes'
    ) THEN
        CREATE POLICY "Users can create their own notes" 
          ON public.notes_v2 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Create UPDATE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes_v2' 
        AND policyname = 'Users can update their own notes'
    ) THEN
        CREATE POLICY "Users can update their own notes" 
          ON public.notes_v2 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    -- Create DELETE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notes_v2' 
        AND policyname = 'Users can delete their own notes'
    ) THEN
        CREATE POLICY "Users can delete their own notes" 
          ON public.notes_v2 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Some policies may already exist, continuing...';
END $$;

-- Enable real-time for notes_v2 table
ALTER TABLE public.notes_v2 REPLICA IDENTITY FULL;

-- Add tables to real-time publication (ignore if already added)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notes_v2;
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Table notes_v2 already in publication';
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.folders;
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Table folders already in publication';
END $$;

-- Also ensure folders table has proper real-time setup
ALTER TABLE public.folders REPLICA IDENTITY FULL;
