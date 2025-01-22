import { CircleCalendar } from "@/components/CircleCalendar";
import { MoodTracker } from "@/components/MoodTracker";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { DailyTasks } from "@/components/DailyTasks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentPhase = "menstruation"; // This would be dynamic based on the day
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleTaskComplete = (taskType: string) => {
    if (!completedTasks.includes(taskType)) {
      setCompletedTasks([...completedTasks, taskType]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
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

      {/* Mobile content area with proper padding and spacing */}
      <main className="flex-1 px-4 py-6 overflow-y-auto space-y-8 bg-white/60 backdrop-blur-md">
        <CircleCalendar />
        
        <MoodTracker phase={currentPhase} />
        
        <DailyTasks
          phase={currentPhase}
          completedTasks={completedTasks}
          onTaskComplete={handleTaskComplete}
        />

        <PhaseExplanation />
      </main>
    </div>
  );
};

export default Dashboard;