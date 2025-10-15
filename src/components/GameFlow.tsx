import { useState } from "react";
import { SplashScreen } from "./SplashScreen";
import { PreMenstrualGame } from "./PreMenstrualGame";
import { MenstrualGame } from "./MenstrualGame";
import { MenopauseGame } from "./MenopauseGame";
import { CycleSanctuary } from "./CycleSanctuary";
import { useCycleTracking } from "@/hooks/useCycleTracking";

type GameFlowScreen = 'splash' | 'pre-menstrual' | 'menstrual' | 'post-menstrual' | 'sanctuary';
type CyclePhase = "menstruation" | "follicular" | "ovulatory" | "luteal";

export const GameFlow = () => {
  const [currentScreen, setCurrentScreen] = useState<GameFlowScreen>('splash');
  const { getCurrentPhase } = useCycleTracking();
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>(getCurrentPhase());

  const handleSplashComplete = () => {
    setCurrentScreen('pre-menstrual');
  };

  const handlePreMenstrualComplete = () => {
    setCurrentScreen('menstrual');
  };

  const handleMenstrualComplete = () => {
    setCurrentScreen('post-menstrual');
  };

  const handlePostMenstrualComplete = () => {
    setCurrentScreen('sanctuary');
  };

  const handlePhaseChange = (phase: CyclePhase) => {
    setCurrentPhase(phase);
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentScreen === 'pre-menstrual') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <PreMenstrualGame onComplete={handlePreMenstrualComplete} />
      </div>
    );
  }

  if (currentScreen === 'menstrual') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        <MenstrualGame onComplete={handleMenstrualComplete} />
      </div>
    );
  }

  if (currentScreen === 'post-menstrual') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <MenopauseGame 
          onComplete={handlePostMenstrualComplete}
          symptomResponses={{}}
        />
      </div>
    );
  }

  return <CycleSanctuary currentPhase={currentPhase} onPhaseChange={handlePhaseChange} />;
};
