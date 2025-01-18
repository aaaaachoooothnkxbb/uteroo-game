import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type Affirmation = {
  text: string;
  phase: string;
  instructions: string[];
};

const affirmations: Affirmation[] = [
  {
    text: "Rest and recharge",
    phase: "menstruation",
    instructions: [
      "Find a quiet space for 5 minutes",
      "Take 3 deep breaths",
      "Repeat the affirmation 3 times",
      "Write down how you feel"
    ]
  },
  {
    text: "Embrace new challenges",
    phase: "follicular",
    instructions: [
      "Stand tall with confidence",
      "Visualize your goals",
      "Say the affirmation out loud",
      "Write one challenge you'll tackle today"
    ]
  },
  {
    text: "Radiate confidence",
    phase: "ovulatory",
    instructions: [
      "Look in the mirror",
      "Strike a power pose",
      "Repeat affirmation with enthusiasm",
      "Share your energy with others"
    ]
  },
  {
    text: "Nurture yourself",
    phase: "luteal",
    instructions: [
      "Find a comfortable position",
      "Place hand on heart",
      "Breathe deeply while saying affirmation",
      "Journal your self-care intentions"
    ]
  },
];

export const DailyAffirmation = ({ phase = "menstruation" }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const affirmation = affirmations.find((a) => a.phase === phase) || affirmations[0];

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const newSteps = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      if (newSteps.length === affirmation.instructions.length) {
        toast({
          title: "Great job!",
          description: "You've completed today's affirmation practice.",
        });
      }
      return newSteps;
    });
  };

  return (
    <Card className={`p-6 bg-${phase}-bg border-${phase}-primary max-w-md mx-auto`}>
      <div className="text-center space-y-4">
        <span className="text-4xl animate-float">🌟</span>
        <h3 className="text-xl font-medium">Today's Affirmation</h3>
        <p className={`text-${phase}-primary text-lg font-medium italic`}>
          "{affirmation.text}"
        </p>
        
        <div className="space-y-2 text-left mt-4">
          <h4 className="font-medium text-sm text-gray-600">Practice Instructions:</h4>
          <div className="space-y-2">
            {affirmation.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`step-${index}`}
                  checked={completedSteps.includes(index)}
                  onCheckedChange={() => toggleStep(index)}
                />
                <label
                  htmlFor={`step-${index}`}
                  className={`text-sm cursor-pointer ${
                    completedSteps.includes(index) ? "line-through opacity-70" : ""
                  }`}
                >
                  {instruction}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className={`mt-4 text-${phase}-primary hover:bg-${phase}-light`}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
};