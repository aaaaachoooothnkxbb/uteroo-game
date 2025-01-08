import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    lastPeriod: "",
    cycleLength: "28",
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      toast({
        title: "Please fill in all fields",
        description: "We need your name and email to continue",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!formData.lastPeriod || !formData.cycleLength)) {
      toast({
        title: "Please fill in all fields",
        description: "We need your cycle information to personalize your experience",
        variant: "destructive",
      });
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-menstruation-light to-menstruation-bg p-4">
      <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Uteroo</h1>
          <p className="text-gray-600">
            {step === 1
              ? "Let's get to know each other!"
              : step === 2
              ? "Tell us about your cycle"
              : "Almost there!"}
          </p>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="lastPeriod">Last Period Start Date</Label>
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
                <Label htmlFor="cycleLength">Cycle Length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  min="21"
                  max="35"
                  value={formData.cycleLength}
                  onChange={(e) =>
                    setFormData({ ...formData, cycleLength: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="animate-float">
                <span className="text-6xl">🌸</span>
              </div>
              <p className="text-lg">
                Hey {formData.name}! I'm Uteroo, your buddy through the ups and
                downs of your cycle! Let's discover what your body needs every step
                of the way.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleNext}
            className="bg-menstruation-primary hover:bg-menstruation-secondary text-white px-8"
          >
            {step === 3 ? "Let's Begin!" : "Next"}
          </Button>
        </div>

        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step
                  ? "bg-menstruation-primary"
                  : "bg-menstruation-light"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};