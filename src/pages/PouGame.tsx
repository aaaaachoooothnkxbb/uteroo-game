import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UterooCharacter } from "@/components/UterooCharacter";
import { useToast } from "@/hooks/use-toast";
import { audioService } from "@/utils/audioService";
import { cn } from "@/lib/utils";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const enemies = {
  menstruation: [
    { id: "cramps", name: "Cramps", hp: 3, icon: "/lovable-uploads/52b8fe36-6c7e-4397-b705-b055fa4d0c62.png", suggestion: "Warm tea" },
    { id: "fatigue", name: "Fatigue", hp: 2, icon: "/lovable-uploads/d67a2349-3eb7-47bf-b2b7-e52514f533f2.png", suggestion: "10-min rest" }
  ],
  follicular: [
    { id: "anxiety", name: "Anxiety", hp: 2, icon: "/lovable-uploads/d53d93fd-3fa3-4ab3-aa9a-f36a2f184218.png", suggestion: "Deep breathing" },
    { id: "migraine", name: "Migraine", hp: 3, icon: "/lovable-uploads/61451e82-27fc-4110-94e4-a08167b4d8db.png", suggestion: "Dim lights" }
  ],
  ovulatory: [
    { id: "sensitivity", name: "Sensitivity", hp: 2, icon: "/lovable-uploads/5456ad76-fc4d-41bf-af80-f17afa7e0ff8.png", suggestion: "Quiet time" },
    { id: "migraine", name: "Migraine", hp: 3, icon: "/lovable-uploads/4a7e6242-abfe-4345-9727-07fd2c60357a.png", suggestion: "Cold compress" }
  ],
  luteal: [
    { id: "irritability", name: "Irritability", hp: 3, icon: "/lovable-uploads/d400493e-b747-4572-9f72-d3e592cc4a3f.png", suggestion: "Meditation" },
    { id: "sadness", name: "Sadness", hp: 3, icon: "/lovable-uploads/b63fbdb8-0dd0-463d-9269-7bce9726d517.png", suggestion: "Self-care" }
  ]
};

const PouGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the initial phase from the location state or default to menstruation
  const [currentPhase, setCurrentPhase] = useState<Phase>(() => {
    const initialPhase = location.state?.initialPhase as Phase;
    return initialPhase || "menstruation";
  });
  
  const [currentEnemies, setCurrentEnemies] = useState(enemies[currentPhase]);

  useEffect(() => {
    console.log("Initial phase from navigation:", location.state?.initialPhase);
    
    // Show a toast to indicate which phase we're starting with
    if (location.state?.initialPhase) {
      toast({
        title: `Starting in ${location.state.initialPhase} phase`,
        description: `Fighting ${enemies[location.state.initialPhase as Phase].length} enemies`,
        duration: 3000,
      });

      // Play phase sound when starting
      audioService.playPhaseSound(location.state.initialPhase);
    }
  }, [location.state, toast]);

  useEffect(() => {
    setCurrentEnemies(enemies[currentPhase]);
  }, [currentPhase]);

  return (
    <div className="min-h-screen relative">
      
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ 
          backgroundImage: "url('/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png')",
          backgroundSize: 'cover',
        }}
      />
      
      {/* Phase-themed color overlay */}
      <div className={cn(
        "fixed inset-0 opacity-25 transition-colors duration-500",
        currentPhase === "menstruation" ? "bg-pink-400" :
        currentPhase === "follicular" ? "bg-green-400" :
        currentPhase === "ovulatory" ? "bg-yellow-400" :
        "bg-orange-400"
      )} />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main content area - centered character with enemies */}
        <div className="flex-1 flex items-center justify-center">
          <UterooCharacter 
            phase={currentPhase} 
            currentRoom="bedroom"
            size="large" 
            minimal={false} 
            enemies={currentEnemies}
          />
        </div>
      </div>
    </div>
  );
};

export default PouGame;
