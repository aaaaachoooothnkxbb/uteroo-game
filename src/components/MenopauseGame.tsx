
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LogOut, Heart, CoinsIcon, Flame, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UterooCharacter } from "@/components/UterooCharacter";
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AudioToggle } from "@/components/AudioToggle";
import { audioService } from "@/utils/audioService";
import { UterooTutorial } from "@/components/UterooTutorial";

interface MenopauseGameProps {
  onComplete: () => void;
  symptomResponses: Record<string, number>;
}

type MenopausePhase = "perimenopause" | "menopause" | "postmenopause";

// Define the FloatingHeart interface
interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

// Clinical phase information
const phaseInfo = {
  perimenopause: {
    name: "Phase 1",
    subtitle: "HORMONAL FLUCTUATION",
    emoji: "🌊",
    color: "blue",
    nextPhase: "menopause",
    background: "bg-blue-50",
    description: "Dynamic shifts in reproductive hormones with variable patterns",
    recommendedActivities: ["Thermoregulation protocols", "Cognitive optimization", "Stress mitigation"],
    nutritionalFocus: ["Estrogen metabolism support", "Anti-inflammatory foods", "Micronutrient optimization"],
    statModifiers: {
      hunger: -0.4,
      hygiene: -0.3,
      energy: -0.6,
      happiness: -0.5
    }
  },
  menopause: {
    name: "Phase 2", 
    subtitle: "CESSATION POINT",
    emoji: "🎯",
    color: "purple",
    nextPhase: "postmenopause",
    background: "bg-purple-50",
    description: "Absence of menstruation for 12 consecutive months",
    recommendedActivities: ["HRT optimization", "Bone density preservation", "Cardiovascular monitoring"],
    nutritionalFocus: ["Calcium fortification", "Vitamin D optimization", "Phytoestrogen-rich foods"],
    statModifiers: {
      hunger: -0.5,
      hygiene: -0.4,
      energy: -0.4,
      happiness: -0.3
    }
  },
  postmenopause: {
    name: "Phase 3",
    subtitle: "SUSTAINED WELLNESS",
    emoji: "🌟",
    color: "green",
    nextPhase: "perimenopause",
    background: "bg-green-50",
    description: "Long-term health optimization with emphasis on skeletal and cardiovascular integrity",
    recommendedActivities: ["Comprehensive wellness planning", "Biomarker monitoring", "Preventive interventions"],
    nutritionalFocus: ["Anti-inflammatory patterns", "Heart-healthy lipids", "Collagen support"],
    statModifiers: {
      hunger: -0.3,
      hygiene: -0.2,
      energy: -0.2,
      happiness: -0.1
    }
  }
};

// Clinical challenges (enemies)
const menopauseChallenges = {
  perimenopause: [
    { 
      id: "vasomotor_instability", 
      name: "Vasomotor Instability", 
      hp: 3, 
      icon: "/lovable-uploads/52b8fe36-6c7e-4397-b705-b055fa4d0c62.png", 
      suggestion: "Thermoregulation Protocol"
    },
    { 
      id: "cognitive_modulation", 
      name: "Cognitive Modulation", 
      hp: 2, 
      icon: "/lovable-uploads/d67a2349-3eb7-47bf-b2b7-e52514f533f2.png", 
      suggestion: "Neuro-Optimization"
    }
  ],
  menopause: [
    { 
      id: "vaginal_atrophy", 
      name: "Vaginal Atrophy", 
      hp: 2, 
      icon: "/lovable-uploads/d53d93fd-3fa3-4ab3-aa9a-f36a2f184218.png", 
      suggestion: "Urogenital Support"
    },
    { 
      id: "bone_demineralization", 
      name: "Bone Demineralization", 
      hp: 3, 
      icon: "/lovable-uploads/61451e82-27fc-4110-94e4-a08167b4d8db.png", 
      suggestion: "Skeletal Preservation"
    }
  ],
  postmenopause: [
    { 
      id: "cardiovascular_risk", 
      name: "Cardiovascular Risk", 
      hp: 3, 
      icon: "/lovable-uploads/d400493e-b747-4572-9f72-d3e592cc4a3f.png", 
      suggestion: "Cardiac Optimization"
    },
    { 
      id: "articular_discomfort", 
      name: "Articular Discomfort", 
      hp: 2, 
      icon: "/lovable-uploads/b63fbdb8-0dd0-463d-9269-7bce9726d517.png", 
      suggestion: "Joint Support Protocol"
    }
  ]
};

// Clinical intervention boosters
const clinicalBoosters = {
  thermoregulation: [
    {
      id: "cooling_protocol",
      name: "Cooling Protocol",
      type: "hygiene" as const,
      icon: "/lovable-uploads/861f1be0-201e-4269-be4e-3b74dbb8e136.png",
      boost: 25,
      tooltip: {
        title: "Thermoregulation Management",
        description: "Evidence-based cooling techniques and environmental modifications to manage vasomotor symptoms during hormonal transitions."
      }
    }
  ],
  neuro_optimization: [
    {
      id: "cognitive_support",
      name: "Cognitive Enhancement",
      type: "energy" as const,
      icon: "/lovable-uploads/de0368a0-d48f-46c5-99c6-fec67d055986.png",
      boost: 20,
      tooltip: {
        title: "Neuro-Optimization Protocol",
        description: "Targeted B-vitamins, Omega-3 fatty acids, and cognitive exercises to support brain function during hormonal changes."
      }
    }
  ],
  biomarker_analysis: [
    {
      id: "hormone_panel",
      name: "Hormone Panel Analysis",
      type: "energy" as const,
      icon: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png",
      boost: 30,
      tooltip: {
        title: "Medical Predictive Analytics",
        description: "Comprehensive assessment of FSH, AMH, and Inhibin B levels to objectively characterize hormonal status and optimize interventions."
      }
    }
  ]
};

export const MenopauseGame: React.FC<MenopauseGameProps> = ({ onComplete, symptomResponses }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<MenopausePhase>("perimenopause");
  
  const [stats, setStats] = useState({
    hunger: 75,
    hygiene: 90,
    energy: 60,
    happiness: 85,
    coins: 200,
    hearts: 0
  });
  
  const [streak, setStreak] = useState(0);
  const [currentChallenges, setCurrentChallenges] = useState(menopauseChallenges[currentPhase]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [consecutiveClicks, setConsecutiveClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showHeartBonus, setShowHeartBonus] = useState(false);
  const [lastStreakUpdateTime, setLastStreakUpdateTime] = useState(0);

  useEffect(() => {
    setCurrentChallenges(menopauseChallenges[currentPhase]);
  }, [currentPhase]);

  // Stat degradation based on phase
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => {
        const modifiers = phaseInfo[currentPhase].statModifiers;
        const newStats = {
          ...prevStats,
          hunger: Math.max(0, prevStats.hunger + modifiers.hunger),
          hygiene: Math.max(0, prevStats.hygiene + modifiers.hygiene),
          energy: Math.max(0, prevStats.energy + modifiers.energy),
          happiness: Math.max(0, prevStats.happiness + modifiers.happiness),
        };

        // Alert for low stats
        Object.entries(newStats).forEach(([stat, value]) => {
          if (value < 20 && stat !== 'coins' && stat !== 'hearts') {
            toast({
              title: `${stat.charAt(0).toUpperCase() + stat.slice(1)} Optimization Needed`,
              description: `Your ${stat} levels require attention. Consider implementing targeted interventions.`,
              variant: "destructive",
            });
          }
        });

        return newStats;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [currentPhase, toast]);

  const updateStreak = useCallback(() => {
    const now = Date.now();
    
    if (now - lastStreakUpdateTime < 20000) {
      return;
    }
    
    setLastStreakUpdateTime(now);
    setStreak(prevStreak => prevStreak + 1);
    
    if ((streak + 1) % 10 === 0) {
      const bonus = Math.floor((streak + 1) / 10) * 50;
      setStats(prev => ({
        ...prev,
        coins: prev.coins + bonus,
      }));
      
      audioService.play('bonus');
      
      toast({
        title: `🎉 ${streak + 1}-Day Wellness Milestone!`,
        description: `Excellent adherence to your wellness protocol! +${bonus} coins earned.`,
        duration: 5000,
      });
    } else {
      setStats(prev => ({
        ...prev,
        coins: prev.coins + 10,
      }));
      
      toast({
        title: `Wellness streak: ${streak + 1} days`,
        description: "Consistent self-care practices optimize outcomes. +10 coins",
        duration: 2000,
      });
    }
  }, [streak, lastStreakUpdateTime, toast]);

  const handleBoosterClick = (booster: any) => {
    audioService.play('click');
    updateStreak();
    
    setStats(prev => {
      const newStats = { ...prev };
      switch (booster.type) {
        case "hunger":
          newStats.hunger = Math.min(100, prev.hunger + booster.boost);
          break;
        case "hygiene":
          newStats.hygiene = Math.min(100, prev.hygiene + booster.boost);
          break;
        case "energy":
          newStats.energy = Math.min(100, prev.energy + booster.boost);
          break;
        case "happiness":
          newStats.happiness = Math.min(100, prev.happiness + booster.boost);
          break;
      }
      return newStats;
    });

    toast({
      title: `${booster.name} Applied`,
      description: `Clinical intervention successful. +${booster.boost} ${booster.type} optimization.`,
    });
  };

  const handlePhaseChange = (newPhase: MenopausePhase) => {
    if (newPhase !== currentPhase) {
      audioService.play('levelup');
      setCurrentPhase(newPhase);
      
      toast({
        title: `Transitioning to ${phaseInfo[newPhase].subtitle}`,
        description: phaseInfo[newPhase].description,
        duration: 4000,
      });
    }
  };

  const handleUterooClick = useCallback(() => {
    const now = Date.now();
    let heartsToAdd = 1;
    
    if (now - lastClickTime < 2000) {
      const newConsecutiveClicks = consecutiveClicks + 1;
      setConsecutiveClicks(newConsecutiveClicks);
      
      if (newConsecutiveClicks >= 10) {
        heartsToAdd = 5;
        setShowHeartBonus(true);
        setTimeout(() => {
          setShowHeartBonus(false);
        }, 2000);
        
        audioService.play('bonus');
        setConsecutiveClicks(0);
      }
    } else {
      setConsecutiveClicks(1);
    }
    
    setLastClickTime(now);
    
    setStats(prev => ({
      ...prev,
      hearts: prev.hearts + heartsToAdd
    }));
    
    audioService.play('heart');
    
    const newHeart: FloatingHeart = {
      id: `heart-${Date.now()}-${Math.random()}`,
      x: Math.random() * 40 - 20,
      y: -20 - Math.random() * 30,
    };
    
    setFloatingHearts(prev => [...prev, newHeart]);
    
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
    }, 1500);
    
    toast({
      title: `+${heartsToAdd} Self-Care Point${heartsToAdd > 1 ? 's' : ''}!`,
      description: heartsToAdd > 1 ? "Bonus for consistent self-compassion!" : "Self-compassion is fundamental to wellness optimization. 💖",
      duration: 1500,
    });
  }, [consecutiveClicks, lastClickTime, toast]);

  const phase = phaseInfo[currentPhase];
  const getProgressColor = (value: number) => {
    if (value > 66) return "bg-green-500";
    if (value > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderPhaseProgress = () => {
    const currentDay = 15;
    const phaseDuration = 30;
    const nextPhase = phase.nextPhase as MenopausePhase;
    const nextPhaseInfo = phaseInfo[nextPhase];
    
    return (
      <div className="mx-auto max-w-xs">
        <div className="flex items-center mb-1 justify-between">
          <div className="flex items-center">
            <span className="mr-1 text-xl">{phase.emoji}</span>
            <h2 className={cn(
              "text-base font-bold tracking-wider uppercase",
              currentPhase === "perimenopause" ? "text-blue-600" :
              currentPhase === "menopause" ? "text-purple-600" :
              "text-green-600"
            )}>
              {phase.subtitle} <span className="font-normal">• DAY {currentDay}/{phaseDuration}</span>
            </h2>
          </div>
        </div>
        
        <div className="relative mb-1">
          <Progress 
            value={(currentDay/phaseDuration) * 100} 
            indicatorClassName={cn(
              "h-2 rounded-full",
              currentPhase === "perimenopause" ? "bg-blue-500" :
              currentPhase === "menopause" ? "bg-purple-500" :
              "bg-green-500"
            )}
            className="h-2 rounded-full bg-gray-200"
          />
        </div>
      </div>
    );
  };

  const renderStatsPanel = () => {
    return (
      <div className="max-w-md mx-auto mt-2 mb-4">
        <div className="flex items-center gap-2 px-2 py-1.5 backdrop-blur-sm rounded-full">
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
            <span className="text-sm font-semibold">{stats.hearts}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <CoinsIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-semibold">{stats.coins}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-semibold">{streak}d</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ 
          backgroundImage: "url('/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png')",
          backgroundSize: 'cover',
        }}
      />
      
      <div className={cn(
        "fixed inset-0 opacity-25 transition-colors duration-500",
        currentPhase === "perimenopause" ? "bg-blue-400" :
        currentPhase === "menopause" ? "bg-purple-400" :
        "bg-green-400"
      )} />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 backdrop-blur-sm z-30 pt-4 pb-2 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full h-8 w-8 p-0"
                  onClick={() => {
                    audioService.play('click');
                    setShowTutorial(true);
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <AudioToggle />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full h-8 w-8 p-0"
                  onClick={onComplete}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center mb-3">
              <div className="flex gap-2">
                {(Object.keys(phaseInfo) as MenopausePhase[]).map((phaseName) => {
                  return (
                    <Button
                      key={phaseName}
                      variant={currentPhase === phaseName ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePhaseChange(phaseName)}
                      className={cn(
                        "w-8 h-8 p-0 rounded-full text-xs",
                        currentPhase === phaseName && 
                          (phaseName === "perimenopause" ? "bg-blue-500 border-blue-300" :
                           phaseName === "menopause" ? "bg-purple-500 border-purple-300" :
                           "bg-green-500 border-green-300")
                      )}
                    >
                      {phaseInfo[phaseName].emoji}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {renderPhaseProgress()}
          </div>
        </div>

        <div className="flex-1 pt-52 pb-6 px-4">
          <div className="max-w-md mx-auto">
            {renderStatsPanel()}
            
            <div className="relative flex flex-col items-center justify-center mb-4 mx-auto">
              {showHeartBonus && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-bold animate-bounce-slow z-20">
                  +5 Self-Care Bonus! 💗
                </div>
              )}
              
              {floatingHearts.map(heart => (
                <div
                  key={heart.id}
                  className="absolute pointer-events-none"
                  style={{
                    transform: `translate(${heart.x}px, ${heart.y}px)`,
                    animation: 'float-up 1.5s ease-out forwards'
                  }}
                >
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                    <span className="text-xs font-bold text-white bg-pink-500 rounded-full px-1 ml-0.5">+1</span>
                  </div>
                </div>
              ))}

              <UterooCharacter 
                phase="follicular"
                currentRoom="bedroom"
                size="large" 
                minimal={false} 
                onClick={handleUterooClick}
                enemies={currentChallenges}
              />
            </div>

            {/* Clinical intervention boosters */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              {clinicalBoosters.thermoregulation.map((booster) => (
                <TooltipProvider key={booster.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center p-4 h-auto justify-start"
                        onClick={() => handleBoosterClick(booster)}
                      >
                        <img src={booster.icon} alt={booster.name} className="w-6 h-6 mr-3" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{booster.name}</div>
                          <div className="text-xs text-gray-500">Evidence-based intervention</div>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 p-3 max-w-xs">
                      <h4 className="font-semibold mb-1">{booster.tooltip?.title}</h4>
                      <p className="text-sm text-gray-600">{booster.tooltip?.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>

        {showTutorial && (
          <UterooTutorial onClose={() => {
            audioService.play('click');
            setShowTutorial(false);
          }} />
        )}
      </div>
    </div>
  );
};
