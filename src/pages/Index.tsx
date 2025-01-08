import { useState } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { CircleCalendar } from "@/components/CircleCalendar";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { DailyAffirmation } from "@/components/DailyAffirmation";

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-menstruation-light to-menstruation-bg">
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-menstruation-primary mb-8">
          Welcome to Uteroo
        </h1>
        
        <div className="grid gap-8">
          <CircleCalendar />
          <DailyAffirmation phase="menstruation" />
          <PhaseExplanation />
        </div>
      </div>
    </div>
  );
};

export default Index;