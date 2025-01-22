import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type Affirmation = {
  text: string;
  phase: string;
  instructions: string[];
};

const affirmations: Affirmation[] = [
  {
    text: "I am in tune with my body's needs and honor my rest",
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

interface DailyAffirmationProps {
  phase?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const DailyAffirmation = ({ 
  phase = "menstruation",
  onComplete,
  isCompleted = false
}: DailyAffirmationProps) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const affirmation = affirmations.find((a) => a.phase === phase) || affirmations[0];

  const toggleStep = (index: number) => {
    if (isCompleted) return;
    
    setCompletedSteps(prev => {
      const newSteps = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      if (newSteps.length === affirmation.instructions.length) {
        toast({
          title: "Great job!",
          description: "You've completed today's affirmation practice.",
        });
        onComplete?.();
      }
      return newSteps;
    });
  };

  return (
    <Card className={`p-6 bg-${phase}-bg border-${phase}-primary max-w-md mx-auto ${
      isCompleted ? "bg-opacity-50" : ""
    }`}>
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MessageCircle className={`w-5 h-5 text-${phase}-primary`} />
          <h3 className="text-xl font-medium">Today's Affirmation</h3>
        </div>
        
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2 text-green-500">
            <Check className="w-5 h-5" />
            <p className="text-lg font-medium">Well done! 🌟</p>
          </div>
        ) : (
          <p className={`text-${phase}-primary text-lg font-medium italic`}>
            "{affirmation.text}"
          </p>
        )}
        
        <div className="space-y-2 text-left mt-4">
          <h4 className="font-medium text-sm text-gray-600">Practice Instructions:</h4>
          <div className="space-y-2">
            {affirmation.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`step-${index}`}
                  checked={completedSteps.includes(index) || isCompleted}
                  onCheckedChange={() => toggleStep(index)}
                  disabled={isCompleted}
                />
                <label
                  htmlFor={`step-${index}`}
                  className={`text-sm cursor-pointer ${
                    completedSteps.includes(index) || isCompleted ? "line-through opacity-70" : ""
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
          disabled={isCompleted}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
};