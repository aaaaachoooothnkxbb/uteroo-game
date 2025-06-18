
-- Create table to track user login activities
CREATE TABLE public.user_login_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  login_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for user login activities
ALTER TABLE public.user_login_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own login activities
CREATE POLICY "Users can insert their own login activities" 
  ON public.user_login_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to view their own login activities
CREATE POLICY "Users can view their own login activities" 
  ON public.user_login_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add questionnaire_answers column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS questionnaire_answers JSONB;

-- Add user_type column to profiles table if it doesn't exist  
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_type TEXT;
