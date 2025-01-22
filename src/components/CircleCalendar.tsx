import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UterooCharacter } from "./UterooCharacter";
import { DailyAffirmation } from "./DailyAffirmation";
import { DailyRecipe } from "./DailyRecipe";
import { YogaPose } from "./YogaPose";
import { Progress } from "@/components/ui/progress";
import { Confetti } from "lucide-react";

const TOTAL_DAYS = 28;
const CIRCLE_SIZE = 300; // px
const POINT_SIZE = 20; // px

export const CircleCalendar = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const { toast } = useToast();

  const calculatePosition = (index: number) => {
    const angle = ((index - 1) * 360) / TOTAL_DAYS;
    const radian = (angle * Math.PI) / 180;
    const radius = CIRCLE_SIZE / 2 - POINT_SIZE;
    
    return {
      left: `${radius * Math.cos(radian) + CIRCLE_SIZE / 2 - POINT_SIZE / 2}px`,
      top: `${radius * Math.sin(radian) + CIRCLE_SIZE / 2 - POINT_SIZE / 2}px`,
    };
  };

  const getPhaseColor = (day: number) => {
    if (day <= 7) return "menstruation";
    if (day <= 14) return "follicular";
    if (day <= 21) return "ovulatory";
    return "luteal";
  };

  const getCurrentPhase = () => getPhaseColor(currentDay);

  const handleDayClick = (day: number) => {
    if (day <= currentDay + 1) {
      setCurrentDay(day);
      toast({
        title: "Day unlocked!",
        description: "New activities and challenges are available.",
      });
    }
  };

  const handleTaskComplete = (taskType: string) => {
    if (!completedTasks.includes(taskType)) {
      const newCompletedTasks = [...completedTasks, taskType];
      setCompletedTasks(newCompletedTasks);
      
      if (newCompletedTasks.length === 3) {
        toast({
          title: "Amazing job! 🎉",
          description: "You've completed all tasks for today! +10 points earned!",
        });
      }
    }
  };

  const currentProgress = (completedTasks.length / 3) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-8 w-fit mx-auto bg-transparent border-none shadow-none">
        <div
          className="relative"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
          {/* Center the UterooCharacter */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <UterooCharacter phase={getCurrentPhase()} />
          </div>

          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
            const phase = getPhaseColor(day);
            const isLocked = day > currentDay + 1;
            const isCurrentDay = day === currentDay;
            
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={isLocked}
                style={{
                  ...calculatePosition(day),
                  width: POINT_SIZE,
                  height: POINT_SIZE,
                }}
                className={`absolute rounded-full flex items-center justify-center text-xs
                  ${
                    isLocked
                      ? "bg-gray-200 cursor-not-allowed"
                      : `bg-${phase}-primary hover:bg-${phase}-secondary text-white cursor-pointer`
                  }
                  ${isCurrentDay ? "ring-2 ring-offset-2 animate-pulse" : ""}
                  transition-all duration-300`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Progress tracker */}
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Daily Progress</span>
          <span>{completedTasks.length}/3 completed</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
        {completedTasks.length === 3 && (
          <div className="flex items-center justify-center gap-2 text-green-500 animate-bounce">
            <Confetti className="w-4 h-4" />
            <span className="text-sm font-medium">All tasks completed!</span>
          </div>
        )}
      </div>

      {/* Daily recommendations */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        <DailyAffirmation 
          phase={getCurrentPhase()} 
          onComplete={() => handleTaskComplete("affirmation")} 
          isCompleted={completedTasks.includes("affirmation")}
        />
        <DailyRecipe 
          phase={getCurrentPhase()} 
          onComplete={() => handleTaskComplete("recipe")}
          isCompleted={completedTasks.includes("recipe")}
        />
        <YogaPose 
          phase={getCurrentPhase()} 
          onComplete={() => handleTaskComplete("yoga")}
          isCompleted={completedTasks.includes("yoga")}
        />
      </div>
    </div>
  );
};