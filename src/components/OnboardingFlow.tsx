import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HormoneInfo } from "./onboarding/HormoneInfo";
import { WelcomeStep } from "./onboarding/WelcomeStep";

const sections = [
  {
    title: "Age",
    description: "How old are you?",
    options: [
      { label: "Under 18", value: "under_18", emoji: "👶" },
      { label: "18-24", value: "18_24", emoji: "🧑" },
      { label: "25-34", value: "25_34", emoji: "🧑‍🎤" },
      { label: "35-44", value: "35_44", emoji: "🧑‍🦳" },
      { label: "45+", value: "45_plus", emoji: "👵" },
    ],
    fields: ["age"],
  },
  {
    title: "Cycle Length",
    description: "What is your average cycle length?",
    options: [
      { label: "Less than 21 days", value: "less_21", emoji: "📅" },
      { label: "21-35 days", value: "21_35", emoji: "📅" },
      { label: "More than 35 days", value: "more_35", emoji: "📅" },
    ],
    fields: ["cycleLength"],
  },
  {
    title: "Period Length",
    description: "How long does your period last?",
    options: [
      { label: "Less than 3 days", value: "less_3", emoji: "🩸" },
      { label: "3-7 days", value: "3_7", emoji: "🩸" },
      { label: "More than 7 days", value: "more_7", emoji: "🩸" },
    ],
    fields: ["periodLength"],
  },
  {
    title: "Symptoms",
    description: "What symptoms do you experience?",
    options: [
      { label: "Cramps", value: "cramps", emoji: "😖" },
      { label: "Mood Swings", value: "mood_swings", emoji: "😡" },
      { label: "Fatigue", value: "fatigue", emoji: "😴" },
      { label: "Headaches", value: "headaches", emoji: "🤕" },
    ],
    fields: ["symptoms"],
  },
  {
    title: "Goals",
    description: "What are your goals?",
    options: [
      { label: "Track my cycle", value: "track_cycle", emoji: "📈" },
      { label: "Manage symptoms", value: "manage_symptoms", emoji: "💪" },
      { label: "Improve wellness", value: "improve_wellness", emoji: "🌱" },
    ],
    fields: ["goals"],
  },
];

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [showHormoneInfo, setShowHormoneInfo] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    cycleLength: "",
    periodLength: "",
    symptoms: [] as string[],
    goals: [] as string[],
  });

  const { toast } = useToast();

  const handleOptionSelect = (option: { value: string }) => {
    const field = sections[currentSection].fields[0] as keyof typeof formData;
    if (Array.isArray(formData[field])) {
      if (formData[field].includes(option.value)) {
        setFormData({
          ...formData,
          [field]: formData[field].filter((value) => value !== option.value),
        });
      } else {
        setFormData({
          ...formData,
          [field]: [...formData[field], option.value],
        });
      }
    } else {
      setFormData({
        ...formData,
        [field]: option.value,
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Onboarding Complete!",
      description: "Thank you for sharing your information.",
    });
    onComplete();
  };

  if (showHormoneInfo) {
    return (
      <HormoneInfo
        onContinue={() => {
          setShowHormoneInfo(false);
          setStep(2);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FF69B4] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white/90 backdrop-blur-sm">
        {step === 1 ? (
          <WelcomeStep
            onExperiencedClick={() => setStep(2)}
            onNewUserClick={() => setShowHormoneInfo(true)}
          />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {sections[currentSection].title}
              </h3>
              <p className="text-gray-600">{sections[currentSection].description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sections[currentSection].options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    formData[sections[currentSection].fields[0] as keyof typeof formData].includes(
                      option.value
                    )
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-4 px-3 flex flex-col items-center text-center space-y-2"
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-sm">{option.label}</span>
                </Button>
              ))}
            </div>

            {currentSection === sections.length - 1 && (
              <Button
                onClick={handleComplete}
                className="w-full bg-[#FF69B4] hover:bg-[#FF1493] text-white"
              >
                Complete
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
