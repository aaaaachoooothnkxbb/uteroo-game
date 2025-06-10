
-- Add avatar columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN avatar_animal TEXT,
ADD COLUMN avatar_color TEXT DEFAULT 'brown',
ADD COLUMN avatar_accessory TEXT DEFAULT 'none';
