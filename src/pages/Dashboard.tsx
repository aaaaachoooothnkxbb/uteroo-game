import { CircleCalendar } from "@/components/CircleCalendar";
import { DailyRecipe } from "@/components/DailyRecipe";
import { YogaPose } from "@/components/YogaPose";
import { MoodTracker } from "@/components/MoodTracker";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentPhase = "menstruation"; // This would be dynamic based on the day

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <nav className="flex justify-between items-center bg-white/20 backdrop-blur-lg rounded-lg p-4">
          <Button variant="ghost" onClick={() => navigate("/profile")}>Profile</Button>
          <Button variant="ghost" onClick={() => navigate("/rewards")}>Rewards</Button>
          <Button variant="ghost" onClick={() => navigate("/settings")}>Settings</Button>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CircleCalendar />
          <MoodTracker phase={currentPhase} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DailyAffirmation phase={currentPhase} />
          <div className="space-y-4">
            <YogaPose phase={currentPhase} />
            <Button 
              className="w-full"
              onClick={() => navigate("/yoga")}
            >
              Play Yoga Game
            </Button>
          </div>
          <div className="space-y-4">
            <DailyRecipe phase={currentPhase} />
            <Button 
              className="w-full"
              onClick={() => navigate("/recipe")}
            >
              Play Cooking Game
            </Button>
          </div>
        </div>

        <PhaseExplanation />
      </div>
    </div>
  );
};

export default Dashboard;