import { useState } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/dashboard");
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#FF69B4] flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Placeholder for future Uteroo character image */}
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-2xl">Uteroo</span>
          </div>
          {/* Placeholder for future logo */}
          <div className="w-48 h-12 bg-white/20 rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-xl font-bold">Uteroo</span>
          </div>
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