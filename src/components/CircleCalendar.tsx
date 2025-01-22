import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UterooCharacter } from "./UterooCharacter";
import { Progress } from "@/components/ui/progress";
import { Sparkles, BookOpen, Sun, Wind, BookMarked } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TOTAL_DAYS = 28;
const CIRCLE_SIZE = 300; // px
const POINT_SIZE = 20; // px

const dailyChallenges = [
  {
    title: "Mindful Breathing",
    description: "Take 5 deep breaths, holding each for 4 seconds",
    icon: Wind,
  },
  {
    title: "Reading Time",
    description: "Read 10 pages of any book you enjoy",
    icon: BookOpen,
  },
  {
    title: "Sunlight Break",
    description: "Spend 10 minutes in natural sunlight",
    icon: Sun,
  },
  {
    title: "Journaling",
    description: "Write down three things you're grateful for",
    icon: BookMarked,
  },
];

export const CircleCalendar = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showChallenge, setShowChallenge] = useState(false);
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
      
      if (newCompletedTasks.length === 1) {
        toast({
          title: "Amazing job! 🎉",
          description: "You've completed today's challenge! +10 points earned!",
        });
      }
    }
  };

  // Get a random challenge for the day
  const getDailyChallenge = () => {
    const index = currentDay % dailyChallenges.length;
    return dailyChallenges[index];
  };

  const currentProgress = (completedTasks.length / 1) * 100;
  const dailyChallenge = getDailyChallenge();

  return (
    <div className="space-y-6">
      <Card className="p-8 w-fit mx-auto bg-transparent border-none shadow-none">
        <div
          className="relative"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
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
          <span>{completedTasks.length}/1 completed</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
        {completedTasks.length === 1 && (
          <div className="flex items-center justify-center gap-2 text-green-500 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Challenge completed!</span>
          </div>
        )}
      </div>

      {/* Daily Challenge Icon */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowChallenge(true)}
          className={`p-4 rounded-full bg-${getCurrentPhase()}-primary hover:bg-${getCurrentPhase()}-secondary transition-colors
            ${completedTasks.includes('challenge') ? 'opacity-50' : 'animate-pulse'}
          `}
        >
          <dailyChallenge.icon className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Challenge Dialog */}
      <Dialog open={showChallenge} onOpenChange={setShowChallenge}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <dailyChallenge.icon className="w-5 h-5" />
              {dailyChallenge.title}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-gray-600 mb-6">{dailyChallenge.description}</p>
            <button
              onClick={() => {
                handleTaskComplete('challenge');
                setShowChallenge(false);
              }}
              className={`w-full py-2 px-4 rounded-md bg-${getCurrentPhase()}-primary hover:bg-${getCurrentPhase()}-secondary text-white transition-colors
                ${completedTasks.includes('challenge') ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={completedTasks.includes('challenge')}
            >
              {completedTasks.includes('challenge') ? 'Completed!' : 'Complete Challenge'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};