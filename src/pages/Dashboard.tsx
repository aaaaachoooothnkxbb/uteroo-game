import { CircleCalendar } from "@/components/CircleCalendar";
import { MoodTracker } from "@/components/MoodTracker";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { DailyTasks } from "@/components/DailyTasks";
import { HormoneAnalyst } from "@/components/HormoneAnalyst";
import { RecipeRoulette } from "@/components/RecipeRoulette";
import { CycleRewards } from "@/components/CycleRewards";
import { CulturalWellness } from "@/components/CulturalWellness";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentPhase = "menstruation"; // This would be dynamic based on the day
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [streak, setStreak] = useState(0); // This would be fetched from the backend

  const handleTaskComplete = (taskType: string) => {
    if (!completedTasks.includes(taskType)) {
      setCompletedTasks([...completedTasks, taskType]);
      setStreak(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg p-4 shadow-sm">
        <nav className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            Profile
          </Button>
          <Button variant="ghost" onClick={() => navigate("/rewards")}>
            Rewards
          </Button>
          <Button variant="ghost" onClick={() => navigate("/settings")}>
            Settings
          </Button>
        </nav>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto space-y-8 bg-white/60 backdrop-blur-md">
        <CircleCalendar />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HormoneAnalyst phase={currentPhase} />
          <MoodTracker phase={currentPhase} />
        </div>
        
        <RecipeRoulette phase={currentPhase} />
        
        <DailyTasks
          phase={currentPhase}
          completedTasks={completedTasks}
          onTaskComplete={handleTaskComplete}
        />

        <CycleRewards streak={streak} />
        
        <CulturalWellness phase={currentPhase} />

        <PhaseExplanation />
      </main>
    </div>
  );
};

export default Dashboard;