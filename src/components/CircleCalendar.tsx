import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UterooCharacter } from "./UterooCharacter";
import { supabase } from "@/integrations/supabase/client";

const TOTAL_DAYS = 28;
const CIRCLE_SIZE = 300; // px
const POINT_SIZE = 20; // px

interface CircleCalendarProps {
  initialDay?: number;
}

export const CircleCalendar = ({ initialDay = 1 }: CircleCalendarProps) => {
  const [currentDay, setCurrentDay] = useState(initialDay);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentDay(initialDay);
  }, [initialDay]);

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

  const handleDayClick = async (day: number) => {
    if (day <= currentDay + 1) {
      setCurrentDay(day);
      
      // Log the activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('daily_activities')
          .insert({
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            activity_type: 'calendar_check',
            completed: true,
            points: 5
          });

        if (!error) {
          toast({
            title: "Day unlocked!",
            description: "New activities and challenges are available. +5 points earned!",
          });
        }
      }
    }
  };

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
                  ${day === currentDay ? "ring-2 ring-offset-2" : ""}
                  transition-all duration-300`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};