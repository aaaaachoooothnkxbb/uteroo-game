import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UterooCharacter } from "./UterooCharacter";
import { Progress } from "@/components/ui/progress";
import { Sparkles, BookOpen, Sun, Wind, BookMarked } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCycleTracking } from "@/hooks/useCycleTracking";
import { getPhaseEmoji } from "@/utils/cycleCalculations";

const dailyChallenges = {
  menstruation: [
    {
      title: "Gentle Rest",
      description: "Take 10 minutes to lie down and practice deep breathing",
      icon: Wind,
    },
    {
      title: "Mindful Reading",
      description: "Read something calming and nurturing",
      icon: BookOpen,
    }
  ],
  follicular: [
    {
      title: "Energy Boost",
      description: "Take a brisk 10-minute walk in natural light",
      icon: Sun,
    },
    {
      title: "Creative Planning",
      description: "Write down your goals for the upcoming weeks",
      icon: BookMarked,
    }
  ],
  ovulatory: [
    {
      title: "Social Connection",
      description: "Reach out to a friend or loved one",
      icon: BookOpen,
    },
    {
      title: "Active Movement",
      description: "Do your favorite form of exercise",
      icon: Wind,
    }
  ],
  luteal: [
    {
      title: "Self-Care Ritual",
      description: "Take a relaxing bath or practice skincare",
      icon: Sun,
    },
    {
      title: "Mindful Journaling",
      description: "Write down your feelings and reflections",
      icon: BookMarked,
    }
  ]
};

export const CircleCalendar = () => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const { toast } = useToast();
  
  // Use cycle tracking hook
  const { currentCycleInfo, getCurrentPhase, getCurrentDay, getCycleLength } = useCycleTracking();
  
  const currentPhase = getCurrentPhase();
  const currentDay = getCurrentDay();
  const cycleLength = getCycleLength();

  const CIRCLE_SIZE = 300;
  const POINT_SIZE = 20;

  const calculatePosition = (index: number) => {
    const angle = ((index - 1) * 360) / cycleLength;
    const radian = (angle * Math.PI) / 180;
    const radius = CIRCLE_SIZE / 2 - POINT_SIZE;
    
    return {
      left: `${radius * Math.cos(radian) + CIRCLE_SIZE / 2 - POINT_SIZE / 2}px`,
      top: `${radius * Math.sin(radian) + CIRCLE_SIZE / 2 - POINT_SIZE / 2}px`,
    };
  };

  const getPhaseColor = (day: number) => {
    if (!currentCycleInfo) {
      // Fallback to old logic if no cycle info
      if (day <= 7) return "menstruation";
      if (day <= 14) return "follicular";
      if (day <= 21) return "ovulatory";
      return "luteal";
    }

    // Use actual cycle calculation
    const periodLength = 5; // Could be made configurable
    const ovulationDay = Math.round(currentCycleInfo.cycleLength - 14);
    
    if (day <= periodLength) return "menstruation";
    if (day < ovulationDay - 2) return "follicular";
    if (day >= ovulationDay - 2 && day <= ovulationDay + 2) return "ovulatory";
    return "luteal";
  };

  const handleDayClick = (day: number) => {
    const phase = getPhaseColor(day);
    toast({
      title: `Day ${day} - ${phase.charAt(0).toUpperCase() + phase.slice(1)} Phase`,
      description: "Click the challenge icon below to see today's activities.",
    });
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

  const getCurrentChallenges = () => {
    return dailyChallenges[currentPhase as keyof typeof dailyChallenges];
  };

  const currentProgress = (completedTasks.length / 1) * 100;
  const currentChallenges = getCurrentChallenges();

  const getPhaseStyles = (phase: string) => {
    const styles = {
      menstruation: "bg-red-500 hover:bg-red-600",
      follicular: "bg-green-500 hover:bg-green-600",
      ovulatory: "bg-yellow-500 hover:bg-yellow-600",
      luteal: "bg-purple-500 hover:bg-purple-600"
    };
    return styles[phase as keyof typeof styles] || styles.menstruation;
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 w-fit mx-auto bg-transparent border-none shadow-none">
        <div
          className="relative"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <UterooCharacter phase={currentPhase} />
          </div>

          {/* Show actual cycle days instead of fixed 28 */}
          {Array.from({ length: cycleLength }, (_, i) => i + 1).map((day) => {
            const phase = getPhaseColor(day);
            const isCurrentDay = day === currentDay;
            
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                style={{
                  ...calculatePosition(day),
                  width: POINT_SIZE,
                  height: POINT_SIZE,
                }}
                className={`absolute rounded-full flex items-center justify-center text-xs
                  ${getPhaseStyles(phase)} text-white cursor-pointer
                  ${isCurrentDay ? "ring-2 ring-offset-2 animate-pulse" : ""}
                  transition-all duration-300`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Display current cycle info */}
      {currentCycleInfo && (
        <div className="text-center">
          <h3 className="text-lg font-medium">
            {getPhaseEmoji(currentPhase)} Day {currentDay} of {cycleLength}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {currentPhase} Phase
          </p>
        </div>
      )}

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
          className={`p-4 rounded-full ${getPhaseStyles(currentPhase)} transition-colors
            ${completedTasks.includes('challenge') ? 'opacity-50' : 'animate-pulse'}`}
        >
          {currentChallenges[0].icon && React.createElement(currentChallenges[0].icon, {
            className: "w-6 h-6 text-white"
          })}
        </button>
      </div>

      {/* Challenge Dialog */}
      <Dialog open={showChallenge} onOpenChange={setShowChallenge}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Daily Challenges - {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
            </DialogTitle>
            <DialogDescription>
              Choose a challenge that resonates with you today
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            {currentChallenges.map((challenge, index) => (
              <div key={index} className="space-y-2">
                <h3 className="flex items-center gap-2 font-medium">
                  {React.createElement(challenge.icon, { className: "w-5 h-5" })}
                  {challenge.title}
                </h3>
                <p className="text-gray-600 text-sm">{challenge.description}</p>
                <button
                  onClick={() => {
                    handleTaskComplete('challenge');
                    setShowChallenge(false);
                  }}
                  className={`w-full py-2 px-4 rounded-md ${getPhaseStyles(currentPhase)} text-white transition-colors
                    ${completedTasks.includes('challenge') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={completedTasks.includes('challenge')}
                >
                  {completedTasks.includes('challenge') ? 'Completed!' : 'Complete Challenge'}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
