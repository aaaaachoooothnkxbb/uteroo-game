import { useState } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
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
      <div className="absolute inset-0 bg-[url('lovable-uploads/affe073e-32fe-4691-a9ae-c8a70dbacdc0.png')] bg-cover opacity-30 animate-float"></div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="lovable-uploads/7ebd1c8f-ee04-47d5-876b-12f5fa215609.png"
            alt="Uteroo Character"
            className="w-64 h-64 object-contain animate-bounce"
          />
          <div className="w-64 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
            <span className="text-4xl font-bold font-['Comic_Sans_MS'] tracking-wider animate-pulse text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
              Uteroo
            </span>
          </div>
        </div>

        <p className="text-center text-xl font-medium mt-6">
          Discover your hormones, moods, and energy in a fun way!
        </p>

        <div className="space-y-4 mt-8">
          <div 
            onClick={() => setShowOnboarding(true)}
            className="w-full h-40 relative cursor-pointer group"
          >
            <div 
              className="absolute inset-0 bg-[url('lovable-uploads/e47907e6-61da-4860-97dc-47179e32bcf8.png')] bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform duration-300 flex items-center justify-center"
            >
              <span className="text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                TRY IT FIRST
              </span>
            </div>
          </div>
          <div 
            onClick={() => setShowOnboarding(true)}
            className="w-full h-32 relative cursor-pointer group"
          >
            <div 
              className="absolute inset-0 bg-[url('lovable-uploads/896173af-7204-467f-986c-a542cc467697.png')] bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform duration-300 flex items-center justify-center"
            >
              <span className="text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                SIGN UP
              </span>
            </div>
          </div>
          <div className="relative w-full h-96 group cursor-pointer" onClick={() => setShowOnboarding(true)}>
            <img
              src="lovable-uploads/615abf15-2229-43a2-90d2-4b9a3412fd54.png"
              alt="Login"
              className="w-full h-96 object-contain hover:opacity-90 transform transition hover:scale-105"
              role="button"
              aria-label="Log in"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xs drop-shadow-lg">
              SIGN IN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;