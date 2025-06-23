
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  type: 'single' | 'multiple';
  options: string[];
  emoji: string;
}

// Universal first question
const firstQuestion: Question = {
  id: 'period_status',
  text: 'When was your last period?',
  type: 'single',
  emoji: '🩸',
  options: [
    '📅 Tap to select',
    '🔴 I\'m on it right now!',
    '🌱 I haven\'t gotten my period yet',
    '🦋 I stopped getting my period',
    '🧡 I don\'t remember'
  ]
};

// Menstrual user questions (for "I'm on it right now", "Tap to select", "I don't remember")
const menstrualQuestions: Question[] = [
  {
    id: 'period_length',
    text: 'How long do your periods usually last?',
    type: 'single',
    emoji: '🩸',
    options: [
      '🩸 3-5 days',
      '🩸 6-7 days', 
      '🩸 8+ days',
      '♾️ It varies a lot'
    ]
  },
  {
    id: 'cycle_predictability',
    text: 'How predictable is your cycle?',
    type: 'single',
    emoji: '📅',
    options: [
      '⏰ Like clockwork!',
      '📊 Usually 25-35 days',
      '🥂 Complete surprise every month'
    ]
  },
  {
    id: 'ovulation_signs',
    text: 'Do you notice any signs around ovulation?',
    type: 'single',
    emoji: '🥚',
    options: [
      '🥚 Egg-white discharge',
      '⚡ Energy boost',
      '🚫 No signs'
    ]
  },
  {
    id: 'pms_feelings',
    text: 'How do you feel 5-7 days before your period?',
    type: 'single',
    emoji: '😌',
    options: [
      '⚠️ Irritable/sensitive',
      '🧡 Bloated/craving carbs',
      '🌈 Totally fine, no changes!'
    ]
  },
  {
    id: 'annoying_symptom',
    text: 'What\'s your most annoying symptom?',
    type: 'single',
    emoji: '😣',
    options: [
      '😣 Cramps',
      '🎭 Mood swings',
      '😴 Fatigue'
    ]
  }
];

// Pre-period user questions (for "I haven't gotten my period yet")
const prePeriodQuestions: Question[] = [
  {
    id: 'age_range',
    text: 'How old are you?',
    type: 'single',
    emoji: '🌟',
    options: [
      '🌟 10-12 years old',
      '🌸 13-15 years old',
      '🌺 16+ years old'
    ]
  },
  {
    id: 'app_expectations',
    text: 'What are your expectations towards the app?',
    type: 'multiple',
    emoji: '🎯',
    options: [
      '📚 Learn about my changing body',
      '🤝 Get support and guidance',
      '🎯 Prepare for my first period',
      '💪 Build healthy habits'
    ]
  },
  {
    id: 'puberty_concerns',
    text: 'What concerns you most about puberty?',
    type: 'multiple',
    emoji: '🤔',
    options: [
      '😰 When will my period start?',
      '🤔 Body changes I\'m experiencing',
      '😳 Talking to others about it',
      '🌙 Mood and emotional changes'
    ]
  }
];

// Post-menstrual user questions (for "I stopped getting my period")
const postMenstrualQuestions: Question[] = [
  {
    id: 'menopause_symptoms',
    text: 'What symptoms are you experiencing?',
    type: 'multiple',
    emoji: '🔥',
    options: [
      '🔥 Hot flashes',
      '😴 Sleep disturbances',
      '🎭 Mood changes',
      '🦴 Joint aches',
      '🧠 Brain fog'
    ]
  },
  {
    id: 'managing_changes',
    text: 'How are you managing these changes?',
    type: 'multiple',
    emoji: '💪',
    options: [
      '👩‍⚕️ Working with healthcare providers',
      '🥗 Diet, exercise, and lifestyle adjustments',
      '🌿 Herbal remedies and supplements',
      '👥 Connecting with others in similar situations',
      '🔍 Still figuring out what works for me'
    ]
  },
  {
    id: 'learning_goals',
    text: 'What would you like to learn most about through Uteroo?',
    type: 'multiple',
    emoji: '🌿',
    options: [
      '🌿 Natural ways to manage symptoms',
      '💪 Staying healthy during this transition',
      '🧘‍♀️ Emotional wellness strategies',
      '🩺 Understanding hormonal changes'
    ]
  }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { addResponse, saveQuestionnaire } = useQuestionnaire();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [showCompanionNaming, setShowCompanionNaming] = useState(false);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);

  const classifyUserType = (answer: string): UserType => {
    if (answer.includes('I\'m on it right now') || 
        answer.includes('Tap to select') || 
        answer.includes('I don\'t remember')) {
      return 'MENSTRUAL';
    } else if (answer.includes('I haven\'t gotten my period yet')) {
      return 'PRE_PERIOD';
    } else {
      return 'POST_MENSTRUAL';
    }
  };

  const getCurrentQuestion = (): Question => {
    if (currentStep === 0) {
      return firstQuestion;
    }
    return currentQuestions[currentStep - 1];
  };

  const getTotalSteps = (): number => {
    if (currentStep === 0) return 1; // Just the first question initially
    return currentQuestions.length + 3; // +3 for first question, companion naming, and avatar customization
  };

  const handleAnswer = (answer: string | string[]) => {
    const currentQuestion = getCurrentQuestion();
    const answerValue = Array.isArray(answer) ? answer.join(', ') : answer;
    
    setResponses(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    const response: QuestionnaireResponse = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerValue,
      answerType: currentQuestion.type
    };
    
    addResponse(response);

    // Handle first question - classify user type and set appropriate questions
    if (currentStep === 0) {
      const type = classifyUserType(answerValue);
      setUserType(type);
      
      let typeQuestions: Question[] = [];
      switch (type) {
        case 'MENSTRUAL':
          typeQuestions = menstrualQuestions;
          break;
        case 'PRE_PERIOD':
          typeQuestions = prePeriodQuestions;
          break;
        case 'POST_MENSTRUAL':
          typeQuestions = postMenstrualQuestions;
          break;
      }
      
      setCurrentQuestions(typeQuestions);
      setCurrentStep(1);
    } else {
      // Handle subsequent questions
      if (currentStep < currentQuestions.length) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowCompanionNaming(true);
      }
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

  const currentQuestion = getCurrentQuestion();
  const totalSteps = getTotalSteps();
  const progress = ((currentStep + 1) / totalSteps) * 100;

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
            <span className="text-3xl">{currentQuestion.emoji}</span>
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentQuestion.type === 'single' && (
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

          {currentQuestion.type === 'multiple' && (
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
        </CardContent>
      </Card>
    </div>
  );
};
