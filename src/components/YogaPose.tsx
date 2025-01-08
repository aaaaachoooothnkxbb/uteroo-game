import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

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

export const YogaPose = ({ phase = "menstruation" }) => {
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const { toast } = useToast();
  const pose = yogaPoses[phase];

  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
    toast({
      title: "Photo uploaded successfully!",
      description: "You earned 10 points for completing today's yoga challenge!",
    });
  };

  return (
    <Card className={`p-6 bg-${phase}-bg border-${phase}-primary max-w-md mx-auto`}>
      <div className="space-y-4">
        <h3 className={`text-xl font-medium text-${phase}-primary`}>
          Today's Yoga Pose: {pose.name}
        </h3>
        
        <div className="space-y-2">
          <h4 className="font-medium">Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1">
            {pose.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-600">{instruction}</li>
            ))}
          </ol>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Benefits:</strong> {pose.benefits}
          </p>
        </div>

        <Button
          onClick={handlePhotoUpload}
          disabled={photoUploaded}
          className={`w-full bg-${phase}-primary hover:bg-${phase}-secondary`}
        >
          <Camera className="w-4 h-4 mr-2" />
          {photoUploaded ? "Photo Uploaded!" : "Upload Your Pose"}
        </Button>
      </div>
    </Card>
  );
};