
-- Add onboarding_completed field to profiles table to track who has finished the questionnaire
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing profiles to mark them as needing onboarding (they'll complete it once more)
UPDATE public.profiles 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;
