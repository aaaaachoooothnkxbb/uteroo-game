import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type YogaPose = {
  name: string;
  instructions: string[];
  benefits: string;
  phase: string;
};

const yogaPoses: Record<string, YogaPose> = {
  menstruation: {
    name: "Child's Pose",
    instructions: [
      "Kneel on the floor with toes together and knees hip-width apart",
      "Lower your torso between your knees",
      "Extend your arms alongside your torso with palms facing up",
      "Hold for 5-10 breaths"
    ],
    benefits: "Relieves menstrual cramps and lower back pain",
    phase: "menstruation"
  },
  follicular: {
    name: "Warrior II",
    instructions: [
      "Step your feet 3-4 feet apart",
      "Turn your right foot out 90 degrees",
      "Bend your right knee over your right ankle",
      "Extend arms parallel to the ground"
    ],
    benefits: "Builds strength and increases energy",
    phase: "follicular"
  },
  ovulatory: {
    name: "Tree Pose",
    instructions: [
      "Stand tall with feet together",
      "Place right foot on left inner thigh",
      "Bring palms together at heart center",
      "Focus on a fixed point for balance"
    ],
    benefits: "Improves balance and concentration",
    phase: "ovulatory"
  },
  luteal: {
    name: "Forward Fold",
    instructions: [
      "Stand with feet hip-width apart",
      "Bend forward from the hips",
      "Let arms hang or hold opposite elbows",
      "Bend knees slightly if needed"
    ],
    benefits: "Calms the mind and relieves tension",
    phase: "luteal"
  }
};

interface YogaPoseProps {
  phase?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const YogaPose = ({ 
  phase = "menstruation",
  onComplete,
  isCompleted = false
}: YogaPoseProps) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const pose = yogaPoses[phase];

  const toggleStep = (index: number) => {
    if (isCompleted) return;
    
    setCompletedSteps(prev => {
      const newSteps = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      if (newSteps.length === pose.instructions.length) {
        toast({
          title: "Great job!",
          description: "You've completed today's yoga practice.",
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
      <div className="space-y-4">
        <h3 className={`text-xl font-medium text-black flex items-center gap-2`}>
          Today's Yoga Pose: {pose.name}
          {isCompleted && <Check className="w-5 h-5 text-green-500" />}
        </h3>
        
        <div className="space-y-2">
          <h4 className="font-medium text-black">Instructions:</h4>
          <div className="space-y-2">
            {pose.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`yoga-step-${index}`}
                  checked={completedSteps.includes(index) || isCompleted}
                  onCheckedChange={() => toggleStep(index)}
                  disabled={isCompleted}
                />
                <label
                  htmlFor={`yoga-step-${index}`}
                  className={`text-black cursor-pointer ${
                    completedSteps.includes(index) || isCompleted ? "line-through opacity-70" : ""
                  }`}
                >
                  {instruction}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md">
          <p className="text-sm text-black">
            <strong>Benefits:</strong> {pose.benefits}
          </p>
        </div>

        <Button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full bg-${phase}-primary hover:bg-${phase}-secondary text-white`}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isCompleted ? "Photo Uploaded!" : "Upload Your Pose"}
        </Button>
      </div>
    </Card>
  );
};