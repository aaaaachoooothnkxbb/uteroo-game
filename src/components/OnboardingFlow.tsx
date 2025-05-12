import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PhaseExplanation } from "@/components/PhaseExplanation";

type FormOption = {
  value: string;
  label: string;
  recommendation: string;
};

const formOptions: Record<string, FormOption[]> = {
  age: [
    {
      value: "10-15",
      label: "10-15",
      recommendation: "Hey there! You're likely still getting used to your cycle, which can feel confusing at times. Hormones like estrogen and progesterone fluctuate a lot during these years, which can cause mood swings and changes in your energy levels. Be kind to yourself, and remember that what you're experiencing is normal."
    },
    {
      value: "15-25",
      label: "15-25",
      recommendation: "Hello! At your age, cycles can become more predictable, but things like stress, sleep, and even diet can influence how you feel. Hormones like estrogen and serotonin work together, so mood swings or cravings could be linked to hormonal changes."
    },
    {
      value: "25-45",
      label: "25-45",
      recommendation: "Welcome! You're in a stage where life and hormones might throw you some curveballs. Cravings, mood changes, and energy dips can all be influenced by fluctuating estrogen and progesterone levels, especially if your cycle is irregular."
    }
  ],
  lastPeriod: [
    {
      value: "less-than-week",
      label: "Less than a week ago",
      recommendation: "You might still feel a little tired or low-energy right now, which is normal after your period. Estrogen is starting to rise, and soon you'll likely feel more energized and clear-headed."
    },
    {
      value: "1-2-weeks",
      label: "1 to 2 weeks ago",
      recommendation: "This is the follicular phase, where your body is gearing up for ovulation. Rising estrogen may make you feel more energetic, social, and even motivated!"
    },
    {
      value: "more-than-2-weeks",
      label: "More than 2 weeks ago",
      recommendation: "You might be entering the luteal phase, when progesterone rises. It's normal to feel more introspective, tired, or even experience mood shifts during this time."
    }
  ],
  cycleLength: [
    {
      value: "less-than-21",
      label: "Less than 21 days",
      recommendation: "It sounds like you might have a shorter cycle. This means your body goes through hormonal changes faster than average, which can sometimes feel intense."
    },
    {
      value: "21-35",
      label: "21 to 35 days",
      recommendation: "Your cycle length is typical, and it means your body likely follows a balanced rhythm. Hormonal fluctuations can still cause mood swings, fatigue, or cravings."
    },
    {
      value: "more-than-35",
      label: "More than 35 days",
      recommendation: "Longer cycles mean you might have more time in each hormonal phase, which can come with unique challenges. Tracking your symptoms can help you better predict what's coming."
    }
  ],
  symptoms: [
    {
      value: "cramps-mood-fatigue",
      label: "Cramps, mood swings, fatigue",
      recommendation: "Cramps and fatigue are common during the luteal and menstrual phases, when progesterone and estrogen drop. Mood swings are often linked to serotonin changes."
    },
    {
      value: "bloating-headaches-acne",
      label: "Bloating, headaches, acne",
      recommendation: "These symptoms often happen when estrogen levels fluctuate or when your body retains water during the luteal phase."
    },
    {
      value: "nausea-back-insomnia",
      label: "Nausea, back pain, insomnia",
      recommendation: "Nausea and back pain are common PMS symptoms linked to prostaglandins, which cause uterine contractions. Insomnia can happen when progesterone drops."
    }
  ],
  mood: [
    {
      value: "good-stable",
      label: "Good/Stable",
      recommendation: "That's great to hear! Your hormones may have been in balance, which is why you felt good overall."
    },
    {
      value: "moody-anxious",
      label: "Moody/Anxious",
      recommendation: "Moodiness and anxiety can be linked to fluctuations in estrogen and serotonin. If this happened during your luteal phase, it's completely normal."
    },
    {
      value: "irritable-sad",
      label: "Irritable/Sad",
      recommendation: "Feeling irritable or sad could be linked to low serotonin levels, especially in the premenstrual phase. Be kind to yourself."
    }
  ],
  cravings: [
    {
      value: "salty",
      label: "Yes, salty foods",
      recommendation: "Craving salty foods can happen when your body retains water or during stress. It's okay to indulge a little, but also try potassium-rich foods."
    },
    {
      value: "sweet",
      label: "Yes, sweets or chocolate",
      recommendation: "Craving sweets is common when estrogen and serotonin dip. Dark chocolate is a great choice—it contains magnesium, which helps with mood and muscle relaxation."
    },
    {
      value: "none",
      label: "No, no cravings",
      recommendation: "No cravings? That's great! It likely means your blood sugar and hormones have been balanced."
    }
  ]
};

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    lastPeriod: "",
    cycleLength: "",
    symptoms: "",
    mood: "",
    cravings: "",
  });
  const { toast } = useToast();

  const generateSummary = () => {
    const period = formOptions.lastPeriod.find(o => o.value === formData.lastPeriod);
    const symptoms = formOptions.symptoms.find(o => o.value === formData.symptoms);
    const mood = formOptions.mood.find(o => o.value === formData.mood);

    let phase = "";
    if (period?.value === "less-than-week") phase = "menstrual phase";
    if (period?.value === "1-2-weeks") phase = "follicular phase";
    if (period?.value === "more-than-2-weeks") phase = "luteal phase";

    let phaseInfo = "";
    if (phase === "menstrual phase") {
      phaseInfo = "your estrogen levels are starting to rise";
    } else if (phase === "follicular phase") {
      phaseInfo = "your estrogen levels are increasing, which often brings more energy";
    } else if (phase === "luteal phase") {
      phaseInfo = "your progesterone levels are rising, which might make you feel more reflective";
    }

    const summary = `Welcome to Uteroo! Based on your answers, it looks like you're in your ${phase}. During this time, ${phaseInfo}.

To support your body right now:
• ${symptoms?.recommendation.split('.')[0]}.
• ${mood?.recommendation.split('.')[0]}.

Remember, every cycle is unique, and Uteroo is here to guide you every step of the way. You've got this! 💖`;

    return summary;
  };

  const handleOptionSelect = (field: string, option: FormOption) => {
    setFormData({ ...formData, [field]: option.value });
    toast({
      title: "Great choice!",
      description: option.recommendation,
    });
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(value => value !== "").length;
    return (filledFields / totalFields) * 100;
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (Object.values(formData).some(value => value === "")) {
        toast({
          title: "Please answer all questions",
          description: "We need this information to personalize your experience",
          variant: "destructive",
        });
        return;
      }
      
      const summary = generateSummary();
      toast({
        title: "Welcome to Uteroo!",
        description: summary,
        duration: 10000,
      });
      
      onComplete();
    }
  };

  const handleSkip = () => {
    toast({
      title: "Welcome to Uteroo!",
      description: "You can always complete your profile later in settings.",
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-6 bg-white border shadow-md">
        {step === 1 ? (
          <div className="text-center space-y-6">
            <img
              src="public/lovable-uploads/0d497106-a6a3-4251-ac48-6e002ce44c94.png"
              alt="Welcome"
              className="w-64 h-auto mx-auto animate-bounce-slow"
            />
            <h1 className="text-2xl font-bold text-black">Hi!</h1>
            <p className="text-lg text-black">
              I'm <span className="text-[#FF69B4] font-bold bg-pink-50 px-2 rounded-full">Uteroo</span> your loyal companion through every twist and turn of your hormonal journey.
            </p>
            <p className="text-gray-700">
              Together, we'll navigate the ups and downs, making sure you feel supported and understood every step of the way
            </p>
            <h2 className="text-xl font-bold text-black">
              Who's up for this journey?
            </h2>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setStep(3)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 rounded-full"
              >
                Me!
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 rounded-full"
              >
                I'm new to this...
              </Button>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center text-black">
              UNDERSTANDING YOUR CYCLE
            </h1>
            <p className="text-lg text-center text-gray-700 mb-8">
              Your hormones, including Estrogen, Progesterone, Luteinizing hormone (LH), and 
              Follicle-stimulating hormone (FSH), play a crucial role in your cycle. They influence 
              your mood, energy, and overall well-being.
            </p>
            <PhaseExplanation />
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setStep(3)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 rounded-full"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Progress value={calculateProgress()} className="w-full rounded-full" />
            
            <div className="text-center mb-8">
              <h2 className="text-2xl text-[#FF69B4] font-bold mb-2">
                Let's Get to Know You Better
              </h2>
              <p className="text-gray-700 italic">
                Your answers help us provide personalized support throughout your journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(formOptions).map(([field, options]) => (
                <div key={field} className="space-y-3">
                  <h3 className="font-medium text-lg capitalize text-black">
                    {field.replace(/([A-Z])/g, ' $1').trim()}?
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {options.map((option) => (
                      <Button
                        key={option.value}
                        onClick={() => handleOptionSelect(field, option)}
                        variant={formData[field as keyof typeof formData] === option.value ? "default" : "outline"}
                        className={`w-full justify-start text-left h-auto py-3 px-4 rounded-full ${
                          formData[field as keyof typeof formData] === option.value 
                            ? "bg-[#9370DB] text-white" 
                            : "text-black hover:bg-pink-50"
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-between mt-8">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="text-[#FF69B4] hover:bg-pink-50 rounded-full"
              >
                Skip for now
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
