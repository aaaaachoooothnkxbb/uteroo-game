import { useState, useEffect } from "react";
import { CycleSanctuary } from "@/components/CycleSanctuary";
import { useCycleTracking } from "@/hooks/useCycleTracking";

type CyclePhase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const Index = () => {
  // Use cycle tracking to get current phase
  const { getCurrentPhase } = useCycleTracking();
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>(getCurrentPhase());

  // Update phase when cycle tracking changes
  useEffect(() => {
    setCurrentPhase(getCurrentPhase());
  }, [getCurrentPhase]);

  const handlePhaseChange = (phase: CyclePhase) => {
    setCurrentPhase(phase);
  };

  return <CycleSanctuary currentPhase={currentPhase} onPhaseChange={handlePhaseChange} />;
};

export default Index;
