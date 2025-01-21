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
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg p-4 shadow-sm">
        <nav className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/profile")}>Profile</Button>
          <Button variant="ghost" onClick={() => navigate("/rewards")}>Rewards</Button>
          <Button variant="ghost" onClick={() => navigate("/settings")}>Settings</Button>
        </nav>
      </header>

      {/* Mobile content area with proper padding and spacing */}
      <main className="flex-1 px-4 py-6 overflow-y-auto space-y-6 bg-white/60 backdrop-blur-md">
        <div className="space-y-6">
          <CircleCalendar />
          <MoodTracker phase={currentPhase} />
        </div>

        <div className="space-y-6">
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
      </main>
    </div>
  );
};

export default Dashboard;