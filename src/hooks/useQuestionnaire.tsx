
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type UserType = 'MENSTRUAL' | 'PRE_PERIOD' | 'POST_MENSTRUAL';

export interface QuestionnaireResponse {
  questionId: string;
  questionText: string;
  answerValue: string;
  answerType: 'single' | 'multiple' | 'text';
}

export const useQuestionnaire = () => {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [userType, setUserType] = useState<UserType | null>(null);
  const { toast } = useToast();

  const classifyUserType = (firstQuestionAnswer: string): UserType => {
    if (firstQuestionAnswer === "I'm on it right now" || 
        firstQuestionAnswer === "Tap to select" || 
        firstQuestionAnswer === "I don't remember") {
      return 'MENSTRUAL';
    } else if (firstQuestionAnswer === "I haven't gotten my period yet") {
      return 'PRE_PERIOD';
    } else {
      return 'POST_MENSTRUAL';
    }
  };

  const addResponse = (response: QuestionnaireResponse) => {
    setResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== response.questionId);
      return [...filtered, response];
    });

    // Classify user type based on first question
    if (response.questionId === 'period_status') {
      const type = classifyUserType(response.answerValue);
      setUserType(type);
    }
  };

  const saveQuestionnaire = async (userId: string, completedUserType: UserType) => {
    try {
      // Calculate next questionnaire due date (10 days from now)
      const now = new Date();
      const dueDate = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 days

      // Save individual responses to questionnaire_responses table
      const responseInserts = responses.map(response => ({
        user_id: userId,
        user_type: completedUserType,
        question_id: response.questionId,
        question_text: response.questionText,
        answer_type: response.answerType,
        answer_value: response.answerValue,
        questionnaire_type: 'onboarding'
      }));

      const { error: responsesError } = await supabase
        .from('questionnaire_responses')
        .insert(responseInserts);

      if (responsesError) {
        console.error('Error saving questionnaire responses:', responsesError);
        throw responsesError;
      }

      // Save/update user type in user_types table
      const { error: userTypeError } = await supabase
        .from('user_types')
        .upsert({
          user_id: userId,
          user_type: completedUserType,
          classification_date: now.toISOString().split('T')[0]
        }, {
          onConflict: 'user_id'
        });

      if (userTypeError) {
        console.error('Error saving user type:', userTypeError);
        throw userTypeError;
      }

      // Update profile with questionnaire completion data including health data
      const questionnaire_answers = responses.reduce((acc, response) => {
        acc[response.questionId] = response.answerValue;
        return acc;
      }, {} as Record<string, string>);

      // Extract health data for easy access
      const healthData = {
        hydration: responses.find(r => r.questionId === 'hydration')?.answerValue || '0',
        exercise: responses.find(r => r.questionId === 'exercise')?.answerValue || '0',
        nutrition: responses.find(r => r.questionId === 'nutrition')?.answerValue || '1'
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          questionnaire_answers: {
            ...questionnaire_answers,
            health_data: healthData
          },
          questionnaire_completed_at: now.toISOString(),
          questionnaire_due_date: dueDate.toISOString(),
          user_type: completedUserType,
          onboarding_completed: true
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      toast({
        title: "Questionnaire completed!",
        description: "Your responses have been saved successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      toast({
        variant: "destructive",
        title: "Error saving questionnaire",
        description: "Please try again.",
      });
      return false;
    }
  };

  const checkQuestionnaireDue = async (userId: string): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('questionnaire_due_date, onboarding_completed')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking questionnaire due date:', error);
        return true; // Default to showing questionnaire if error
      }

      if (!profile || !profile.onboarding_completed) {
        return true; // Show questionnaire for new users or incomplete onboarding
      }

      if (!profile.questionnaire_due_date) {
        return true; // Show questionnaire if no due date set
      }

      const now = new Date();
      const dueDate = new Date(profile.questionnaire_due_date);
      
      return now >= dueDate; // Show questionnaire if current time is past due date
    } catch (error) {
      console.error('Error checking questionnaire due date:', error);
      return true; // Default to showing questionnaire if error
    }
  };

  return {
    responses,
    userType,
    addResponse,
    saveQuestionnaire,
    checkQuestionnaireDue,
    classifyUserType
  };
};
