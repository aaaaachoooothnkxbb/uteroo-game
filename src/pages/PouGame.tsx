
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { SachetButton } from "@/components/SachetButton";

const PouGame = () => {
  const [happiness, setHappiness] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [health, setHealth] = useState(50);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showBoost, setShowBoost] = useState(false);
  const [boostType, setBoostType] = useState<"happiness" | "energy" | "health">("happiness");
  const [boostAmount, setBoostAmount] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [cyclePhase, setCyclePhase] = useState("follicular");
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const characterRef = useRef<HTMLDivElement>(null);
  const [showStats, setShowStats] = useState(false);
  const [characterState, setCharacterState] = useState<"idle" | "happy" | "tired" | "sick">("idle");

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Uteroo!",
      content: "This is your personal uterus companion. Take care of it by keeping its happiness, energy, and health high!"
    },
    {
      title: "Meet Your Companion",
      content: "Your companion's mood changes based on your cycle phase and how well you're taking care of it."
    },
    {
      title: "Boost Stats",
      content: "Tap your companion to give it attention and boost its stats. Different actions have different effects!"
    },
    {
      title: "Track Your Cycle",
      content: "Your companion reflects your current cycle phase. Use the tools in your sachet to help manage symptoms!"
    }
  ];

  // Load user data from pet_stats table
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // Load pet stats
        const { data: petData, error: petError } = await supabase
          .from('pet_stats')
          .select('happiness, energy, hygiene as health')
          .eq('user_id', user.id)
          .single();
          
        if (petError) {
          console.error('Error loading pet stats:', petError);
          // If no pet stats exist, create them
          if (petError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('pet_stats')
              .insert({
                user_id: user.id,
                happiness: 50,
                energy: 50,
                hygiene: 50
              });
            
            if (insertError) {
              console.error('Error creating pet stats:', insertError);
            }
          }
        } else if (petData) {
          setHappiness(petData.happiness || 50);
          setEnergy(petData.energy || 50);
          setHealth(petData.health || 50);
        }
        
        // Check tutorial completion from localStorage
        const tutorialCompleted = localStorage.getItem(`tutorial_completed_${user.id}`);
        if (!tutorialCompleted) {
          setShowTutorial(true);
        }
      } catch (err) {
        console.error('Error in loadUserData:', err);
      }
    };
    
    loadUserData();
  }, [user]);

  // Save stats to pet_stats table periodically
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('pet_stats')
          .update({
            happiness,
            energy,
            hygiene: health,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error saving stats:', error);
        }
      } catch (err) {
        console.error('Error in save interval:', err);
      }
    }, 60000); // Save every minute
    
    return () => clearInterval(saveInterval);
  }, [happiness, energy, health, user]);

  // Passive stat decrease over time
  useEffect(() => {
    const decayInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteraction;
      
      // Only decay if it's been more than 5 minutes since last interaction
      if (timeSinceLastInteraction > 5 * 60 * 1000) {
        setHappiness(prev => Math.max(prev - 1, 0));
        setEnergy(prev => Math.max(prev - 1, 0));
        setHealth(prev => Math.max(prev - 0.5, 0));
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(decayInterval);
  }, [lastInteraction]);

  // Update character state based on stats
  useEffect(() => {
    if (happiness < 30) {
      setCharacterState("tired");
    } else if (energy < 30) {
      setCharacterState("tired");
    } else if (health < 30) {
      setCharacterState("sick");
    } else if (happiness > 70 && energy > 70) {
      setCharacterState("happy");
    } else {
      setCharacterState("idle");
    }
  }, [happiness, energy, health]);

  const handleCharacterClick = () => {
    // Determine which stat to boost based on lowest value
    let statToBoost: "happiness" | "energy" | "health" = "happiness";
    let lowestValue = happiness;
    
    if (energy < lowestValue) {
      statToBoost = "energy";
      lowestValue = energy;
    }
    
    if (health < lowestValue) {
      statToBoost = "health";
    }
    
    // Random boost amount between 5-15
    const boost = Math.floor(Math.random() * 11) + 5;
    
    // Apply boost
    switch (statToBoost) {
      case "happiness":
        setHappiness(prev => Math.min(prev + boost, 100));
        break;
      case "energy":
        setEnergy(prev => Math.min(prev + boost, 100));
        break;
      case "health":
        setHealth(prev => Math.min(prev + boost, 100));
        break;
    }
    
    // Show boost animation
    setBoostType(statToBoost);
    setBoostAmount(boost);
    setShowBoost(true);
    setTimeout(() => setShowBoost(false), 1000);
    
    // Update last interaction time
    setLastInteraction(Date.now());
    
    // Character animation
    if (characterRef.current) {
      characterRef.current.classList.add("animate-heart-squish");
      setTimeout(() => {
        if (characterRef.current) {
          characterRef.current.classList.remove("animate-heart-squish");
        }
      }, 400);
    }
  };

  const completeTutorial = async () => {
    setShowTutorial(false);
    
    if (user) {
      try {
        localStorage.setItem(`tutorial_completed_${user.id}`, 'true');
      } catch (err) {
        console.error('Error saving tutorial progress:', err);
      }
    }
    
    toast({
      title: "Tutorial completed!",
      description: "You're now ready to take care of your uterus companion!",
    });
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      completeTutorial();
    }
  };

  const getCharacterImage = () => {
    // Use the happy/sad uteroo images based on character state
    if (characterState === "happy") {
      return "/lovable-uploads/50167af2-3f66-47c1-aadb-96e97717d531.png"; // happy uteroo
    } else if (characterState === "sick" || characterState === "tired") {
      return "/lovable-uploads/0a06c37e-fc17-41fc-be9c-2417fa48a098.png"; // sad uteroo
    } else {
      return "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png"; // neutral uteroo
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-30 animate-gentle-float"></div>
      <div className="absolute bottom-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-gentle-float" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-gentle-float" style={{ animationDelay: "4s" }}></div>
      
      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-2 text-purple-600">{tutorialSteps[tutorialStep].title}</h2>
            <p className="mb-6 text-gray-700">{tutorialSteps[tutorialStep].content}</p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowTutorial(false)}>
                Skip Tutorial
              </Button>
              <Button onClick={nextTutorialStep}>
                {tutorialStep < tutorialSteps.length - 1 ? "Next" : "Start"}
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Uteroo</h1>
          <p className="text-sm text-purple-600">Your uterus companion</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-purple-700">Current Phase:</p>
          <p className="text-lg font-bold capitalize text-purple-900">{cyclePhase}</p>
        </div>
      </header>
      
      {/* Main character area */}
      <div className="flex flex-col items-center justify-center p-4 relative" style={{ minHeight: "60vh" }}>
        {/* Character */}
        <div 
          ref={characterRef}
          className="relative cursor-pointer transition-transform hover:scale-105"
          onClick={handleCharacterClick}
        >
          <img 
            src={getCharacterImage()} 
            alt="Uterus character" 
            className="w-64 h-64 object-contain"
          />
          
          {/* Boost animation */}
          {showBoost && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-boost">
              <div className={`text-2xl font-bold ${
                boostType === "happiness" ? "text-pink-500" : 
                boostType === "energy" ? "text-yellow-500" : "text-green-500"
              }`}>
                +{boostAmount}
              </div>
            </div>
          )}
        </div>
        
        {/* Stats toggle button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="mt-4"
        >
          {showStats ? "Hide Stats" : "Show Stats"}
        </Button>
      </div>
      
      {/* Stats area */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 transition-transform duration-300 ${
        showStats ? "translate-y-0" : "translate-y-full"
      }`}>
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-pink-700">Happiness</label>
              <span className="text-sm text-pink-700">{happiness}%</span>
            </div>
            <Progress value={happiness} className="h-2 bg-pink-100" indicatorClassName="bg-pink-500" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-yellow-700">Energy</label>
              <span className="text-sm text-yellow-700">{energy}%</span>
            </div>
            <Progress value={energy} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-green-700">Health</label>
              <span className="text-sm text-green-700">{health}%</span>
            </div>
            <Progress value={health} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
          </div>
        </div>
      </div>

      {/* Sachet Button - Always accessible */}
      <SachetButton 
        currentPhase={cyclePhase}
        currentSymptoms={currentSymptoms}
      />
    </div>
  );
};

export default PouGame;
