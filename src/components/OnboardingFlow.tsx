import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CompanionNaming } from "./CompanionNaming";
import { AvatarCustomization } from "./AvatarCustomization";
import { HealthSlider } from "./HealthSlider";
import { PreMenstrualGame } from "./PreMenstrualGame";
import { PostMenstrualGame } from "./PostMenstrualGame";
import { useAuth } from "./AuthProvider";
import { useQuestionnaire, UserType, QuestionnaireResponse } from '@/hooks/useQuestionnaire';
import { useCustomAuth } from '@/hooks/useCustomAuth';

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

// Menstrual Game Component (the original game)
const MenstrualGame = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-pink-800">
            🩸 Menstrual Phase
          </CardTitle>
          <p className="text-pink-600">Day 2/7</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-pink-200 rounded-full h-2">
            <div className="bg-pink-500 h-2 rounded-full w-1/4"></div>
          </div>
          
          {/* Next phase info */}
          <div className="text-center text-sm text-gray-600">
            Next: FOLLICULAR in 5d
          </div>
          
          {/* Stats */}
          <div className="flex justify-between text-sm">
            <span>❤️ 0</span>
            <span>💰 200</span>
            <span>⭐ 0d</span>
          </div>
          
          {/* Uterus Character */}
          <div className="flex justify-center my-8">
            <div className="relative">
              {/* Main uterus body */}
              <div className="w-32 h-32 bg-pink-400 rounded-full relative">
                {/* Eyes */}
                <div className="absolute top-8 left-6 w-8 h-8 bg-white rounded-full">
                  <div className="absolute top-2 left-2 w-4 h-4 bg-black rounded-full"></div>
                </div>
                <div className="absolute top-8 right-6 w-8 h-8 bg-white rounded-full">
                  <div className="absolute top-2 left-2 w-4 h-4 bg-black rounded-full"></div>
                </div>
                
                {/* Fallopian tubes */}
                <div className="absolute -top-4 -left-8 w-16 h-8 bg-pink-400 rounded-full transform -rotate-45"></div>
                <div className="absolute -top-4 -right-8 w-16 h-8 bg-pink-400 rounded-full transform rotate-45"></div>
                
                {/* Bottom opening */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-pink-500 rounded-b-full"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Phase message */}
          <div className="bg-pink-50 rounded-lg p-4 text-center">
            <p className="text-pink-800 font-medium">
              🌸 Gentle movement reduces cramps!
            </p>
          </div>
          
          {/* Boosters section */}
          <div>
            <h3 className="font-bold mb-4">Boosters</h3>
            <div className="text-right text-sm text-gray-500 mb-2">Tap to use</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📚</div>
                <span className="text-xs">Reading Time</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <span className="text-xs">Daily Journaling</span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🎵</div>
                <span className="text-xs">Affirmation Playlist</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onComplete}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full"
          >
            Continue Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { logout } = useCustomAuth();
  const { addResponse, saveQuestionnaire } = useQuestionnaire();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({});
  const [healthQuestionIndex, setHealthQuestionIndex] = useState(0);
  const [showHealthQuestions, setShowHealthQuestions] = useState(false);
  const [showTypeQuestions, setShowTypeQuestions] = useState(false);
  const [showPreMenstrualGame, setShowPreMenstrualGame] = useState(false);
  const [showPostMenstrualGame, setShowPostMenstrualGame] = useState(false);
  const [showMenstrualGame, setShowMenstrualGame] = useState(false);
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
      // Check if this is a menstrual user answering the "annoying symptom" question
      if (userType === 'MENSTRUAL' && currentQuestion.id === 'annoying_symptom') {
        // Any symptom selection should take them to the menstrual game
        setShowTypeQuestions(false);
        setShowMenstrualGame(true);
        return;
      }

      if (typeQuestionIndex < currentQuestions.length - 1) {
        setTypeQuestionIndex(prev => prev + 1);
      } else {
        // Check user type to show appropriate game
        if (userType === 'PRE_PERIOD') {
          setShowTypeQuestions(false);
          setShowPreMenstrualGame(true);
        } else if (userType === 'POST_MENSTRUAL') {
          setShowTypeQuestions(false);
          setShowPostMenstrualGame(true);
        } else {
          handleOnboardingComplete();
        }
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

  const handleMenstrualGameComplete = () => {
    setShowMenstrualGame(false);
    handleOnboardingComplete();
  };

  const handlePreMenstrualGameComplete = () => {
    setShowPreMenstrualGame(false);
    handleOnboardingComplete();
  };

  const handlePostMenstrualGameComplete = () => {
    setShowPostMenstrualGame(false);
    handleOnboardingComplete();
  };

  const handleOnboardingComplete = async () => {
    if (!user || !userType) return;
    
    const success = await saveQuestionnaire(user.id, userType);
    if (success) {
      onComplete();
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Show Menstrual Game for MENSTRUAL users who selected symptoms
  if (showMenstrualGame) {
    return <MenstrualGame onComplete={handleMenstrualGameComplete} />;
  }

  // Show Pre-Menstrual Game for PRE_PERIOD users
  if (showPreMenstrualGame) {
    return <PreMenstrualGame onComplete={handlePreMenstrualGameComplete} />;
  }

  // Show Post-Menstrual Game for POST_MENSTRUAL users
  if (showPostMenstrualGame) {
    return <PostMenstrualGame onComplete={handlePostMenstrualGameComplete} />;
  }

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
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  Question {currentStepNum} of {totalSteps}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
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
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  Question {currentStepNum} of {totalSteps}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
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
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Question 1 of {totalSteps}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
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
