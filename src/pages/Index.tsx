import { useState } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FF69B4] flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md space-y-8">
        {/* Uteroo Logo/Mascot */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/lovable-uploads/5a9bd3d3-cb17-4c03-a2ba-53d935c828e1.png"
            alt="Uteroo Mascot"
            className="w-32 h-32 animate-bounce"
          />
          <img
            src="/lovable-uploads/2609640b-f01c-4bbe-ba7a-2a29da3be432.png"
            alt="Uteroo Logo"
            className="w-48 animate-pulse"
          />
        </div>

        <p className="text-center text-xl font-medium mt-6">
          Discover your hormones, moods, and energy in a fun way!
        </p>

        <div className="space-y-4 mt-8">
          <Button
            className="w-full bg-white hover:bg-gray-100 text-[#FF69B4] font-semibold py-4 rounded-full shadow-lg transform transition hover:scale-105"
            onClick={() => setShowOnboarding(true)}
          >
            TRY IT FIRST
          </Button>
          <Button
            className="w-full bg-white hover:bg-gray-100 text-[#FF69B4] font-semibold py-4 rounded-full shadow-lg transform transition hover:scale-105"
            onClick={() => setShowOnboarding(true)}
          >
            SIGN UP
          </Button>
          <Button
            className="w-full bg-[#9370DB] hover:bg-[#8A2BE2] text-white font-semibold py-4 rounded-full shadow-lg transform transition hover:scale-105"
            onClick={() => setShowOnboarding(true)}
          >
            LOG IN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;