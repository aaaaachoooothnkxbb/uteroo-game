import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    lastPeriod: "",
    cycleLength: "28",
    symptoms: "",
    mood: "",
    cravings: "",
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && (!formData.age || !formData.lastPeriod)) {
      toast({
        title: "Please fill in all fields",
        description: "We need this information to personalize your experience",
        variant: "destructive",
      });
      return;
    } else {
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
    <div className="min-h-screen bg-[#FF69B4] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white/90 backdrop-blur-sm">
        {step === 1 ? (
          <div className="text-center space-y-6">
            <img
              src="/lovable-uploads/b299e826-f68d-4a0a-b4ae-295d9a500bed.png"
              alt="Welcome"
              className="w-32 h-32 mx-auto"
            />
            <h1 className="text-2xl font-bold">Hi!</h1>
            <p className="text-lg">
              I'm <span className="text-[#FF69B4] font-bold">Uteroo</span> your loyal companion through every twist and turn of your hormonal journey.
            </p>
            <p className="text-gray-600">
              Together, we'll navigate the ups and downs, making sure you feel supported and understood every step of the way
            </p>
            <h2 className="text-xl font-bold text-[#FF69B4]">
              Who's up for this journey?
            </h2>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setStep(2)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8"
              >
                Me!
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8"
              >
                I'm new to this...
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl text-center text-[#FF69B4] font-bold">
              Now, lets get to know you...
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">What is your age?</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastPeriod">When was your last period?</Label>
                <Input
                  id="lastPeriod"
                  type="date"
                  value={formData.lastPeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, lastPeriod: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycleLength">
                  How long is your menstrual cycle (in days)?
                </Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={formData.cycleLength}
                  onChange={(e) =>
                    setFormData({ ...formData, cycleLength: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">
                  What symptoms do you usually experience? (e.g., cramps, mood swings)
                </Label>
                <Input
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mood">
                  How would you describe your overall mood last week?
                </Label>
                <Input
                  id="mood"
                  value={formData.mood}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cravings">
                  Have you experienced any cravings recently?
                </Label>
                <Input
                  id="cravings"
                  value={formData.cravings}
                  onChange={(e) =>
                    setFormData({ ...formData, cravings: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 justify-between">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="text-[#FF69B4] hover:bg-pink-50"
              >
                Skip for now
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white"
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