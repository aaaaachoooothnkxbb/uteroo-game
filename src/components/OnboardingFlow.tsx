import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CompanionNaming } from "./CompanionNaming";
import { AvatarCustomization } from "./AvatarCustomization";
import { HealthSlider } from "./HealthSlider";
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

interface HealthQuestion {
  id: string;
  text: string;
  emoji: string;
  minLabel: string;
  maxLabel: string;
  minValue: number;
  maxValue: number;
}

// Universal first question - updated to support date selection
const firstQuestion: Question = {
  id: 'period_status',
  text: 'When was your last period?',
  type: 'single',
  emoji: '🩸',
  options: [
    '📅 Select date',
    '🔴 I\'m on it right now!',
    '🌱 I haven\'t gotten my period yet',
    '🦋 I stopped getting my period',
    '🧡 I don\'t remember'
  ]
};

// Health questions (universal for all user types)
const healthQuestions: HealthQuestion[] = [
  {
    id: 'hydration',
    text: 'Glasses of water today',
    emoji: '💧',
    minLabel: '0-2',
    maxLabel: '8-10+',
    minValue: 0,
    maxValue: 10
  },
  {
    id: 'exercise',
    text: 'Minutes of activity today',
    emoji: '🏃‍♀️',
    minLabel: '0-10',
    maxLabel: '30-45+',
    minValue: 0,
    maxValue: 45
  },
  {
    id: 'nutrition',
    text: 'Plate "greenness" score',
    emoji: '🥗',
    minLabel: '1-3',
    maxLabel: '8-10',
    minValue: 1,
    maxValue: 10
  }
];

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
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({});
  const [healthQuestionIndex, setHealthQuestionIndex] = useState(0);
  const [showHealthQuestions, setShowHealthQuestions] = useState(false);
  const [showTypeQuestions, setShowTypeQuestions] = useState(false);
  const [typeQuestionIndex, setTypeQuestionIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const classifyUserType = (answer: string): UserType => {
    if (answer.includes('I\'m on it right now') || 
        answer.includes('Select date') || 
        answer.includes('I don\'t remember') ||
        answer.startsWith('Period started on')) {
      return 'MENSTRUAL';
    } else if (answer.includes('I haven\'t gotten my period yet')) {
      return 'PRE_PERIOD';
    } else {
      return 'POST_MENSTRUAL';
    }
  };

  const getCurrentQuestion = (): Question | null => {
    if (currentStep === 0) {
      return firstQuestion;
    }
    if (showTypeQuestions && currentQuestions.length > 0) {
      return currentQuestions[typeQuestionIndex];
    }
    return null;
  };

  const getCurrentHealthQuestion = (): HealthQuestion | null => {
    if (showHealthQuestions && healthQuestionIndex < healthQuestions.length) {
      return healthQuestions[healthQuestionIndex];
    }
    return null;
  };

  const getTotalSteps = (): number => {
    if (currentStep === 0) return 1;
    return 1 + healthQuestions.length + currentQuestions.length;
  };

  const getCurrentStepNumber = (): number => {
    if (currentStep === 0) return 1;
    if (showHealthQuestions) return 1 + healthQuestionIndex + 1;
    if (showTypeQuestions) return 1 + healthQuestions.length + typeQuestionIndex + 1;
    return 1;
  };

  const handleAnswer = (answer: string | string[]) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    const answerValue = Array.isArray(answer) ? answer.join(', ') : answer;
    
    setResponses(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    const response: QuestionnaireResponse = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerValue,
      answerType: currentQuestion.type
    };
    
    addResponse(response);

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
      setShowHealthQuestions(true);
    } else if (showTypeQuestions) {
      if (typeQuestionIndex < currentQuestions.length - 1) {
        setTypeQuestionIndex(prev => prev + 1);
      } else {
        handleOnboardingComplete();
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowDatePicker(false);
      const formattedDate = format(date, 'PPP');
      handleAnswer(`Period started on ${formattedDate}`);
    }
  };

  const handleHealthAnswer = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    const healthQuestion = healthQuestions.find(q => q.id === questionId);
    if (healthQuestion) {
      const response: QuestionnaireResponse = {
        questionId: healthQuestion.id,
        questionText: healthQuestion.text,
        answerValue: value.toString(),
        answerType: 'single'
      };
      
      addResponse(response);
    }
  };

  const handleHealthContinue = () => {
    if (healthQuestionIndex < healthQuestions.length - 1) {
      setHealthQuestionIndex(prev => prev + 1);
    } else {
      setShowHealthQuestions(false);
      setShowTypeQuestions(true);
    }
  };

  const handleOnboardingComplete = async () => {
    if (!user || !userType) return;
    
    const success = await saveQuestionnaire(user.id, userType);
    if (success) {
      onComplete();
    }
  };

  if (showHealthQuestions) {
    const currentHealthQuestion = getCurrentHealthQuestion();
    if (!currentHealthQuestion) return null;

    const totalSteps = getTotalSteps();
    const currentStepNum = getCurrentStepNumber();
    const progress = (currentStepNum / totalSteps) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Question {currentStepNum} of {totalSteps}
              </p>
            </div>
            <CardTitle className="text-2xl font-bold">
              Health Check-In
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <HealthSlider
              questionText={currentHealthQuestion.text}
              emoji={currentHealthQuestion.emoji}
              minLabel={currentHealthQuestion.minLabel}
              maxLabel={currentHealthQuestion.maxLabel}
              minValue={currentHealthQuestion.minValue}
              maxValue={currentHealthQuestion.maxValue}
              value={responses[currentHealthQuestion.id] as number || currentHealthQuestion.minValue}
              onChange={(value) => handleHealthAnswer(currentHealthQuestion.id, value)}
            />
            
            <Button
              onClick={handleHealthContinue}
              className="w-full mt-4 rounded-full"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showTypeQuestions) {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    const totalSteps = getTotalSteps();
    const currentStepNum = getCurrentStepNumber();
    const progress = (currentStepNum / totalSteps) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Question {currentStepNum} of {totalSteps}
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
                    className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
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
                        className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
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
                  onClick={() => handleAnswer(responses[currentQuestion.id] as string[] || [])}
                  disabled={!responses[currentQuestion.id] || (responses[currentQuestion.id] as string[]).length === 0}
                  className="w-full mt-4 rounded-full"
                >
                  Continue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) return null;

  const totalSteps = getTotalSteps();
  const progress = (1 / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              Question 1 of {totalSteps}
            </p>
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
            <span className="text-3xl">{currentQuestion.emoji}</span>
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {currentQuestion.options.map((option) => {
              if (option === '📅 Select date') {
                return (
                  <Popover key={option} open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
                      >
                        {selectedDate ? format(selectedDate, 'PPP') : option}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="pointer-events-auto bg-white rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                );
              }
              
              return (
                <Button
                  key={option}
                  variant="outline"
                  className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
