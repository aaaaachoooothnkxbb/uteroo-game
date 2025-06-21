
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanionNaming } from "./CompanionNaming";
import { AvatarCustomization } from "./AvatarCustomization";
import { useAuth } from "./AuthProvider";
import { useQuestionnaire, UserType, QuestionnaireResponse } from '@/hooks/useQuestionnaire';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  emoji?: string;
  userTypes?: UserType[];
}

const baseQuestions: Question[] = [
  {
    id: 'period_status',
    text: 'When was your last period?',
    type: 'single',
    emoji: '🩸',
    options: [
      "I'm on it right now",
      "Tap to select",
      "I don't remember",
      "I haven't gotten my period yet",
      "I stopped getting my period"
    ]
  }
];

const menstrualQuestions: Question[] = [
  {
    id: 'period_tracking',
    text: 'How do you currently track your period?',
    type: 'single',
    emoji: '📱',
    options: ['App on my phone', 'Calendar/notebook', 'I don\'t track it', 'Other method'],
    userTypes: ['MENSTRUAL']
  },
  {
    id: 'cycle_regularity',
    text: 'How regular is your cycle?',
    type: 'single',
    emoji: '📅',
    options: ['Very regular', 'Somewhat regular', 'Irregular', 'Not sure'],
    userTypes: ['MENSTRUAL']
  },
  {
    id: 'period_symptoms',
    text: 'What symptoms do you experience during your period?',
    type: 'multiple',
    emoji: '💊',
    options: ['Cramps', 'Bloating', 'Mood changes', 'Headaches', 'Fatigue', 'Breast tenderness', 'Food cravings', 'None'],
    userTypes: ['MENSTRUAL']
  }
];

const prePeriodQuestions: Question[] = [
  {
    id: 'age_range',
    text: 'What\'s your age range?',
    type: 'single',
    emoji: '👶',
    options: ['Under 12', '12-14', '15-17', '18+'],
    userTypes: ['PRE_PERIOD']
  },
  {
    id: 'period_education',
    text: 'How would you like to learn about periods?',
    type: 'multiple',
    emoji: '📚',
    options: ['Educational videos', 'Articles and guides', 'Interactive games', 'Q&A sessions', 'Talk with a healthcare provider'],
    userTypes: ['PRE_PERIOD']
  },
  {
    id: 'concerns',
    text: 'What are you most curious or concerned about?',
    type: 'multiple',
    emoji: '🤔',
    options: ['When will it start?', 'What products to use', 'How to manage symptoms', 'Talking to family/friends', 'School considerations', 'Normal vs. abnormal'],
    userTypes: ['PRE_PERIOD']
  }
];

const postMenstrualQuestions: Question[] = [
  {
    id: 'transition_stage',
    text: 'What stage best describes you?',
    type: 'single',
    emoji: '🌸',
    options: ['Perimenopause', 'Menopause', 'Post-menopause', 'Medical condition', 'Not sure'],
    userTypes: ['POST_MENSTRUAL']
  },
  {
    id: 'health_concerns',
    text: 'What health aspects are you focusing on?',
    type: 'multiple',
    emoji: '💪',
    options: ['Bone health', 'Heart health', 'Weight management', 'Sleep quality', 'Mood stability', 'Energy levels', 'Skin care'],
    userTypes: ['POST_MENSTRUAL']
  },
  {
    id: 'wellness_goals',
    text: 'What are your wellness goals?',
    type: 'multiple',
    emoji: '🎯',
    options: ['Stay active', 'Manage symptoms', 'Stress reduction', 'Better nutrition', 'Regular checkups', 'Mental health support'],
    userTypes: ['POST_MENSTRUAL']
  }
];

const commonQuestions: Question[] = [
  {
    id: 'wellness_interests',
    text: 'What wellness activities interest you most?',
    type: 'multiple',
    emoji: '🧘',
    options: ['Yoga and meditation', 'Nutrition and recipes', 'Exercise and fitness', 'Mental health support', 'Educational content', 'Community support']
  },
  {
    id: 'goals',
    text: 'What are your main goals with Uteroo?',
    type: 'multiple',
    emoji: '🎯',
    options: ['Track my cycle', 'Learn about my body', 'Manage symptoms', 'Improve overall wellness', 'Connect with others', 'Get personalized advice']
  }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { addResponse, saveQuestionnaire, userType } = useQuestionnaire();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(baseQuestions);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [textInput, setTextInput] = useState('');
  const [showCompanionNaming, setShowCompanionNaming] = useState(false);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);

  useEffect(() => {
    if (userType) {
      let typeSpecificQuestions: Question[] = [];
      
      switch (userType) {
        case 'MENSTRUAL':
          typeSpecificQuestions = menstrualQuestions;
          break;
        case 'PRE_PERIOD':
          typeSpecificQuestions = prePeriodQuestions;
          break;
        case 'POST_MENSTRUAL':
          typeSpecificQuestions = postMenstrualQuestions;
          break;
      }
      
      setCurrentQuestions([...baseQuestions, ...typeSpecificQuestions, ...commonQuestions]);
    }
  }, [userType]);

  const currentQuestion = currentQuestions[currentStep];
  const totalSteps = currentQuestions.length + 2; // +2 for companion naming and avatar customization
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (answer: string | string[]) => {
    const answerValue = Array.isArray(answer) ? answer.join(', ') : answer;
    
    setResponses(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    const response: QuestionnaireResponse = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerValue,
      answerType: currentQuestion.type
    };
    
    addResponse(response);
    
    // Move to next question
    if (currentStep < currentQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowCompanionNaming(true);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput.trim());
      setTextInput('');
    }
  };

  const handleCompanionNamingComplete = () => {
    setShowCompanionNaming(false);
    setShowAvatarCustomization(true);
  };

  const handleAvatarCustomizationComplete = async () => {
    if (!user || !userType) return;
    
    const success = await saveQuestionnaire(user.id, userType);
    if (success) {
      onComplete();
    }
  };

  if (showAvatarCustomization) {
    return <AvatarCustomization onComplete={handleAvatarCustomizationComplete} />;
  }

  if (showCompanionNaming) {
    return <CompanionNaming onComplete={handleCompanionNamingComplete} />;
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              Question {currentStep + 1} of {totalSteps}
            </p>
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
            {currentQuestion.emoji && (
              <span className="text-3xl">{currentQuestion.emoji}</span>
            )}
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentQuestion.type === 'single' && currentQuestion.options && (
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="p-4 text-left justify-start h-auto whitespace-normal"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiple' && currentQuestion.options && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select all that apply:</p>
              <div className="grid gap-3">
                {currentQuestion.options.map((option) => {
                  const currentResponses = responses[currentQuestion.id] as string[] || [];
                  const isSelected = currentResponses.includes(option);
                  
                  return (
                    <Button
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      className="p-4 text-left justify-start h-auto whitespace-normal"
                      onClick={() => {
                        const current = responses[currentQuestion.id] as string[] || [];
                        const updated = isSelected
                          ? current.filter(item => item !== option)
                          : [...current, option];
                        setResponses(prev => ({ ...prev, [currentQuestion.id]: updated }));
                      }}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
              <Button
                onClick={() => handleAnswer(responses[currentQuestion.id] || [])}
                disabled={!responses[currentQuestion.id] || (responses[currentQuestion.id] as string[]).length === 0}
                className="w-full mt-4"
              >
                Continue
              </Button>
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Type your answer here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
