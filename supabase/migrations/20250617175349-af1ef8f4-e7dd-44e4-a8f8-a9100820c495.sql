
-- Create user_types table to classify users as PRE_MENSTRUAL, MENSTRUAL, or POST_MENSTRUAL
CREATE TABLE public.user_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('PRE_MENSTRUAL', 'MENSTRUAL', 'POST_MENSTRUAL')),
  classification_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create questionnaire_responses table for structured question-answer data
CREATE TABLE public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questionnaire_type TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer_value TEXT NOT NULL,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('input', 'radio', 'slider', 'checkbox')),
  user_type TEXT NOT NULL CHECK (user_type IN ('PRE_MENSTRUAL', 'MENSTRUAL', 'POST_MENSTRUAL')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for user_types table
ALTER TABLE public.user_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own user type" 
  ON public.user_types 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user type" 
  ON public.user_types 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user type" 
  ON public.user_types 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for questionnaire_responses table
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own questionnaire responses" 
  ON public.questionnaire_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questionnaire responses" 
  ON public.questionnaire_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_user_types_user_id ON public.user_types(user_id);
CREATE INDEX idx_user_types_user_type ON public.user_types(user_type);
CREATE INDEX idx_questionnaire_responses_user_id ON public.questionnaire_responses(user_id);
CREATE INDEX idx_questionnaire_responses_user_type ON public.questionnaire_responses(user_type);
CREATE INDEX idx_questionnaire_responses_questionnaire_type ON public.questionnaire_responses(questionnaire_type);

-- Helper function to get user type
CREATE OR REPLACE FUNCTION public.get_user_type(p_user_id UUID)
RETURNS TEXT AS $$
  SELECT user_type FROM public.user_types WHERE user_id = p_user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
