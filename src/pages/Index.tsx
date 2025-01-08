import { useState } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { CircleCalendar } from "@/components/CircleCalendar";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { YogaPose } from "@/components/YogaPose";
import { DailyRecipe } from "@/components/DailyRecipe";
import { MoodTracker } from "@/components/MoodTracker";

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("menstruation");

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${currentPhase}-light to-${currentPhase}-bg`}>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className={`text-4xl font-bold text-center text-${currentPhase}-primary mb-8`}>
          Welcome to Uteroo
        </h1>
        
        <div className="grid gap-8">
          <CircleCalendar />
          <MoodTracker phase={currentPhase} />
          <DailyAffirmation phase={currentPhase} />
          <YogaPose phase={currentPhase} />
          <DailyRecipe phase={currentPhase} />
          <PhaseExplanation />
        </div>
      </div>
    </div>
  );
};

export default Index;