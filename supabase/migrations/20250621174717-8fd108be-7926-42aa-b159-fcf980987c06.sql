
-- Update profiles table to add questionnaire tracking columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS questionnaire_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS questionnaire_due_date TIMESTAMP WITH TIME ZONE;

-- Update user_types table to ensure proper structure for classification tracking
-- (This table already exists but let's make sure it has the right structure)

-- Create an index on questionnaire_due_date for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_questionnaire_due_date 
ON public.profiles(questionnaire_due_date);

-- Create an index on user_types for efficient user type lookups
CREATE INDEX IF NOT EXISTS idx_user_types_user_id 
ON public.user_types(user_id);

-- Create an index on questionnaire_responses for efficient answer retrieval
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user_id 
ON public.questionnaire_responses(user_id);

-- Add RLS policies for questionnaire_responses table if they don't exist
DO $$ 
BEGIN
    -- Enable RLS on questionnaire_responses if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'questionnaire_responses' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Create policy for users to view their own responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'questionnaire_responses' 
        AND policyname = 'Users can view their own questionnaire responses'
    ) THEN
        CREATE POLICY "Users can view their own questionnaire responses"
        ON public.questionnaire_responses
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    -- Create policy for users to insert their own responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'questionnaire_responses' 
        AND policyname = 'Users can insert their own questionnaire responses'
    ) THEN
        CREATE POLICY "Users can insert their own questionnaire responses"
        ON public.questionnaire_responses
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Create policy for users to update their own responses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'questionnaire_responses' 
        AND policyname = 'Users can update their own questionnaire responses'
    ) THEN
        CREATE POLICY "Users can update their own questionnaire responses"
        ON public.questionnaire_responses
        FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Add RLS policies for user_types table if they don't exist
DO $$ 
BEGIN
    -- Enable RLS on user_types if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'user_types' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.user_types ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Create policy for users to view their own user type
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_types' 
        AND policyname = 'Users can view their own user type'
    ) THEN
        CREATE POLICY "Users can view their own user type"
        ON public.user_types
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    -- Create policy for users to insert their own user type
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_types' 
        AND policyname = 'Users can insert their own user type'
    ) THEN
        CREATE POLICY "Users can insert their own user type"
        ON public.user_types
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Create policy for users to update their own user type
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_types' 
        AND policyname = 'Users can update their own user type'
    ) THEN
        CREATE POLICY "Users can update their own user type"
        ON public.user_types
        FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
END $$;
