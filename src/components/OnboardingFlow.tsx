import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
      title: "Welcome to Uteroo!",
      description: "Let's get to know you better.",
      content: "Tell us a bit about yourself so we can personalize your experience.",
      fields: [],
    },
    {
      id: 2,
      title: "Cycle Information",
      description: "Please provide information about your cycle.",
      content: (
        <div>
          <p>What is the typical length of your cycle?</p>
          <input
            type="number"
            placeholder="Cycle Length (days)"
            value={answers.cycleLength || ""}
            onChange={(e) => setAnswers({ ...answers, cycleLength: e.target.value })}
          />
          <p>How long does your period usually last?</p>
          <input
            type="number"
            placeholder="Period Length (days)"
            value={answers.periodLength || ""}
            onChange={(e) => setAnswers({ ...answers, periodLength: e.target.value })}
          />
        </div>
      ),
      fields: ["cycleLength", "periodLength"],
    },
    {
      id: 3,
      title: "Personalize Your Companion",
      description: "Give your Uteroo companion a name!",
      content: (
        <div>
          <p>What would you like to name your companion?</p>
          <input
            type="text"
            placeholder="Companion Name"
            value={answers.companionName || ""}
            onChange={(e) => setAnswers({ ...answers, companionName: e.target.value })}
          />
        </div>
      ),
      fields: ["companionName"],
    },
    {
      id: 4,
      title: "All Done!",
      description: "You're all set!",
      content: "Thank you for providing the information. Let's start your journey!",
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
          .update({ onboarding_completed: true, 
            cycle_length: parseInt(answers.cycleLength),
            period_length: parseInt(answers.periodLength),
            companion_name: answers.companionName
          })
          .eq('id', session.session.user.id);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete(); // Still proceed even if update fails
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Card className="w-full max-w-md space-y-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-gray-500">{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps[currentStep].content}
          {currentStep === 3 && (
            <div className="text-center">
              <Badge variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Onboarding Complete!
              </Badge>
            </div>
          )}
        </CardContent>
        <div className="flex items-center justify-between p-4">
          <Button variant="outline" size="icon" onClick={prevStep} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="flex-grow mx-2" />
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleComplete}>Complete</Button>
          ) : (
            <Button onClick={nextStep}><ChevronRight className="h-4 w-4" /></Button>
          )}
        </div>
      </Card>
    </div>
  );
};
