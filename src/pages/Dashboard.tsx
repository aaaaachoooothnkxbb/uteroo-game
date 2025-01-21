import { CircleCalendar } from "@/components/CircleCalendar";
import { DailyRecipe } from "@/components/DailyRecipe";
import { YogaPose } from "@/components/YogaPose";
import { MoodTracker } from "@/components/MoodTracker";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState("menstruation");
  const [currentDay, setCurrentDay] = useState(1);

  // Fetch user's cycle data
  const { data: cycleData, isLoading } = useQuery({
    queryKey: ['cycleTracking'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cycle_tracking')
        .select('*')
        .order('cycle_start_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0];
    }
  });

  // Calculate current phase based on cycle data
  useEffect(() => {
    if (cycleData) {
      const startDate = new Date(cycleData.cycle_start_date);
      const today = new Date();
      const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const cycleDay = (dayDiff % cycleData.cycle_length) + 1;
      setCurrentDay(cycleDay);

      // Determine phase based on cycle day
      if (cycleDay <= 7) {
        setCurrentPhase("menstruation");
      } else if (cycleDay <= 14) {
        setCurrentPhase("follicular");
      } else if (cycleDay <= 21) {
        setCurrentPhase("ovulatory");
      } else {
        setCurrentPhase("luteal");
      }
    }
  }, [cycleData]);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to access your dashboard",
        });
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
          <CircleCalendar initialDay={currentDay} />
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