import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const YogaGame = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePhotoUpload = () => {
    setScore(score + 10);
    toast({
      title: "Great job!",
      description: `You earned ${10} points for completing this pose!`,
    });
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg p-4 shadow-sm">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <Card className="p-6">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">Yoga Challenge</h1>
            <div className="text-xl">Score: {score}</div>
            
            <div className="space-y-4">
              <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                Pose Preview Area
              </div>

              <Button
                onClick={handlePhotoUpload}
                className="w-full"
              >
                <Camera className="mr-2" />
                Upload Your Pose
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default YogaGame;