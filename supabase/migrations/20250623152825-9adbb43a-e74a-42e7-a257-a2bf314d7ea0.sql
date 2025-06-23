
-- Create a custom users table for username/password authentication
CREATE TABLE public.custom_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the custom_users table
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own record
CREATE POLICY "Users can view their own record"
ON public.custom_users
FOR SELECT
USING (id = (current_setting('app.current_user_id', true))::uuid);

-- Create policy for inserting new users (public access for signup)
CREATE POLICY "Anyone can create users"
ON public.custom_users
FOR INSERT
WITH CHECK (true);

-- Remove the foreign key constraint from profiles table temporarily
-- We'll handle the relationship differently since we're switching auth systems
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Create an index on username for faster lookups
CREATE INDEX idx_custom_users_username ON public.custom_users(username);

-- Clear existing profiles since they're tied to Supabase auth users
-- This is necessary when switching authentication systems
TRUNCATE TABLE public.profiles CASCADE;
