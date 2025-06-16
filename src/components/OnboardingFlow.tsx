
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const steps = [
    {
      id: 1,
      title: "Question 1 of 6",
      subtitle: "Let's get to know your cycle better",
      description: "When did your last period start?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, lastPeriod: "tap-to-select" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.lastPeriod === "tap-to-select" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">📅</span>
              <span className="text-gray-700">Tap to select</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, lastPeriod: "right-now" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.lastPeriod === "right-now" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🔴</span>
              <span className="text-gray-700">I'm on it right now!</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, lastPeriod: "no-period-yet" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.lastPeriod === "no-period-yet" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🌱</span>
              <span className="text-gray-700">I haven't gotten my period yet</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, lastPeriod: "stopped-getting" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.lastPeriod === "stopped-getting" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🦋</span>
              <span className="text-gray-700">I stopped getting my period</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, lastPeriod: "dont-remember" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.lastPeriod === "dont-remember" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🧡</span>
              <span className="text-gray-700">I don't remember</span>
            </button>
          </div>
        </div>
      ),
      fields: ["lastPeriod"],
    },
    {
      id: 2,
      title: "Question 2 of 6",
      subtitle: "Let's get to know your cycle better",
      description: "How long do your periods usually last?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, periodLength: "3-5-days" })}
              className={`w-full p-4 border-2 rounded-full text-left transition-colors ${
                answers.periodLength === "3-5-days" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-gray-700">3-5 days</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, periodLength: "6-7-days" })}
              className={`w-full p-4 border-2 rounded-full text-left transition-colors ${
                answers.periodLength === "6-7-days" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-gray-700">6-7 days</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, periodLength: "8-plus-days" })}
              className={`w-full p-4 border-2 rounded-full text-left transition-colors ${
                answers.periodLength === "8-plus-days" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-gray-700">8+ days</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, periodLength: "varies-a-lot" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.periodLength === "varies-a-lot" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">♾️</span>
              <span className="text-gray-700">It varies a lot</span>
            </button>
          </div>
        </div>
      ),
      fields: ["periodLength"],
    },
    {
      id: 3,
      title: "Question 3 of 6",
      subtitle: "Let's get to know your cycle better",
      description: "How predictable is your cycle?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, cyclePredictability: "like-clockwork" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.cyclePredictability === "like-clockwork" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">⏰</span>
              <span className="text-gray-700">Like clockwork!</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, cyclePredictability: "usually-25-35-days" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.cyclePredictability === "usually-25-35-days" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">📊</span>
              <span className="text-gray-700">Usually 25-35 days</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, cyclePredictability: "complete-surprise" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.cyclePredictability === "complete-surprise" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🥂</span>
              <span className="text-gray-700">Complete surprise every month</span>
            </button>
          </div>
        </div>
      ),
      fields: ["cyclePredictability"],
    },
    {
      id: 4,
      title: "Question 4 of 6",
      subtitle: "Let's get to know your cycle better",
      description: "Do you notice any signs around ovulation?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, ovulationSigns: "egg-white-discharge" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.ovulationSigns === "egg-white-discharge" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🥚</span>
              <span className="text-gray-700">Egg-white discharge</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, ovulationSigns: "energy-boost" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.ovulationSigns === "energy-boost" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">⚡</span>
              <span className="text-gray-700">Energy boost</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, ovulationSigns: "no-signs" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.ovulationSigns === "no-signs" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🚫</span>
              <span className="text-gray-700">No signs</span>
            </button>
          </div>
        </div>
      ),
      fields: ["ovulationSigns"],
    },
    {
      id: 5,
      title: "Question 5 of 6",
      subtitle: "Let's get to know your cycle better",
      description: "How do you feel 5-7 days before your period?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, prePeriodFeeling: "irritable-sensitive" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.prePeriodFeeling === "irritable-sensitive" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">⚠️</span>
              <span className="text-gray-700">Irritable/sensitive</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, prePeriodFeeling: "bloated-craving-carbs" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.prePeriodFeeling === "bloated-craving-carbs" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🧡</span>
              <span className="text-gray-700">Bloated/craving carbs</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, prePeriodFeeling: "totally-fine" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.prePeriodFeeling === "totally-fine" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🌈</span>
              <span className="text-gray-700">Totally fine, no changes!</span>
            </button>
          </div>
        </div>
      ),
      fields: ["prePeriodFeeling"],
    },
    {
      id: 6,
      title: "Question 6 of 6",
      subtitle: "Let's get to know your cycle better",
      description: "What's your most annoying symptom?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, annoyingSymptom: "cramps" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.annoyingSymptom === "cramps" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">😣</span>
              <span className="text-gray-700">Cramps</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, annoyingSymptom: "mood-swings" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.annoyingSymptom === "mood-swings" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🎭</span>
              <span className="text-gray-700">Mood swings</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, annoyingSymptom: "fatigue" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.annoyingSymptom === "fatigue" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">😴</span>
              <span className="text-gray-700">Fatigue</span>
            </button>
          </div>
        </div>
      ),
      fields: ["annoyingSymptom"],
    },
    {
      id: 7,
      title: "Question 3 of 3",
      subtitle: "Let's get to know your journey better",
      description: "How are you managing these changes?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, managingChanges: "healthcare-providers" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.managingChanges === "healthcare-providers" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">👩‍⚕️</span>
              <span className="text-gray-700">Working with healthcare providers</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, managingChanges: "diet-exercise-lifestyle" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.managingChanges === "diet-exercise-lifestyle" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🥗</span>
              <span className="text-gray-700">Diet, exercise, and lifestyle adjustments</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, managingChanges: "herbal-remedies" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.managingChanges === "herbal-remedies" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🌿</span>
              <span className="text-gray-700">Herbal remedies and supplements</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, managingChanges: "connecting-with-others" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.managingChanges === "connecting-with-others" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">👥</span>
              <span className="text-gray-700">Connecting with others in similar situations</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, managingChanges: "still-figuring-out" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.managingChanges === "still-figuring-out" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🔍</span>
              <span className="text-gray-700">Still figuring out what works for me</span>
            </button>
          </div>
        </div>
      ),
      fields: ["managingChanges"],
    },
    {
      id: 8,
      title: "Question 3 of 3",
      subtitle: "Let's get to know your journey better",
      description: "What would you like to learn most about through Uteroo?",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={() => setAnswers({ ...answers, learnAbout: "what-to-expect-period" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.learnAbout === "what-to-expect-period" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🌊</span>
              <span className="text-gray-700">What to expect when my period starts</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, learnAbout: "body-changes-puberty" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.learnAbout === "body-changes-puberty" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🦋</span>
              <span className="text-gray-700">How my body is changing during puberty</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, learnAbout: "healthy-habits-hormonal" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.learnAbout === "healthy-habits-hormonal" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">💪</span>
              <span className="text-gray-700">Building healthy habits for hormonal health</span>
            </button>
            
            <button
              onClick={() => setAnswers({ ...answers, learnAbout: "managing-mood-changes" })}
              className={`w-full p-4 border-2 rounded-full text-left flex items-center gap-3 transition-colors ${
                answers.learnAbout === "managing-mood-changes" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="text-2xl">🎨</span>
              <span className="text-gray-700">Understanding and managing mood changes</span>
            </button>
          </div>
        </div>
      ),
      fields: ["learnAbout"],
    },
    {
      id: 9,
      title: "All Done!",
      subtitle: "You're all set!",
      description: "Thank you for providing the information. Let's start your journey!",
      content: "Welcome to your personalized Uteroo experience!",
      fields: [],
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Mark onboarding as completed in the database
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase
          .from('profiles')
          .update({ 
            onboarding_completed: true,
            questionnaire_answers: answers
          })
          .eq('id', session.session.user.id);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete(); // Still proceed even if update fails
    }
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.fields.length === 0) return true;
    
    return currentStepData.fields.some(field => answers[field]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Card className="w-full max-w-md space-y-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40">
        {/* Header with hearts counter */}
        <div className="flex justify-between items-center p-4 pb-0">
          <span className="text-sm text-gray-500">Screen {currentStep + 1} of {steps.length}</span>
          <span className="flex items-center gap-1 text-pink-500">
            ❤️ {Math.floor(Math.random() * 40) + 5}
          </span>
        </div>
        
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-pink-500">{steps[currentStep].title}</CardTitle>
          {steps[currentStep].subtitle && (
            <p className="text-sm text-gray-500 italic">{steps[currentStep].subtitle}</p>
          )}
          <CardDescription className="text-lg font-medium text-gray-800">
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {typeof steps[currentStep].content === 'string' ? (
            <p className="text-gray-600 text-center">{steps[currentStep].content}</p>
          ) : (
            steps[currentStep].content
          )}
          
          {currentStep === steps.length - 1 && (
            <div className="text-center">
              <Badge variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Onboarding Complete!
              </Badge>
            </div>
          )}
        </CardContent>
        
        <div className="flex items-center justify-between p-4">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={prevStep} className="rounded-full px-6">
              Previous
            </Button>
          ) : (
            <Button variant="ghost" className="rounded-full px-6 opacity-50">
              Skip for now
            </Button>
          )}
          
          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full px-8"
            >
              Get My Results
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full px-8 disabled:opacity-50"
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
