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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-purple-400 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Add decorative clouds using pseudo-elements */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/affe073e-32fe-4691-a9ae-c8a70dbacdc0.png')] bg-cover opacity-30 animate-float"></div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="/lovable-uploads/7ebd1c8f-ee04-47d5-876b-12f5fa215609.png"
            alt="Uteroo Character"
            className="w-64 h-64 object-contain animate-bounce"
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
            className="w-full h-14 bg-[url('/lovable-uploads/615abf15-2229-43a2-90d2-4b9a3412fd54.png')] bg-cover bg-center hover:opacity-90 text-white font-semibold py-4 rounded-full shadow-lg transform transition hover:scale-105 backdrop-blur-sm relative overflow-hidden"
            onClick={() => setShowOnboarding(true)}
          >
            <span className="relative z-10 drop-shadow-lg">LOG IN</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;