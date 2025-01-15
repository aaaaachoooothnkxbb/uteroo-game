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
          <img 
            src="/lovable-uploads/8b746cff-3c5b-419d-aed1-09ca7485d512.png"
            alt="Uteroo Character"
            className="w-48 h-48 object-contain animate-bounce"
          />
          <div className="w-64 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
            <span className="text-3xl font-bold font-['Segoe UI'] tracking-wider animate-pulse text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
              Uteroo
            </span>
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