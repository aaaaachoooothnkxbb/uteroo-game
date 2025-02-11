import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Apple, Bath, Bed, Gamepad, 
  ShoppingBag, Heart, Droplet, BatteryFull, 
  Home, Dumbbell, Brain, Moon, Sun, Leaf, UtensilsCrossed, Laptop 
} from "lucide-react";
import { UterooCharacter } from "@/components/UterooCharacter";
import { useToast } from "@/hooks/use-toast";
import { DraggableItem } from "@/components/DraggableItem";
import { GroceryList } from "@/components/GroceryList";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const enemies = {
  menstruation: [
    { id: "cramps", name: "Cramps", hp: 3, icon: "/lovable-uploads/52b8fe36-6c7e-4397-b705-b055fa4d0c62.png" },
    { id: "fatigue", name: "Fatigue", hp: 2, icon: "/lovable-uploads/d67a2349-3eb7-47bf-b2b7-e52514f533f2.png" }
  ],
  follicular: [
    { id: "anxiety", name: "Anxiety", hp: 2, icon: "/lovable-uploads/2ece6e4e-6cc7-4707-9327-32fcd5ecb10d.png" }
  ],
  ovulatory: [
    { id: "headache", name: "Headache", hp: 2, icon: "/lovable-uploads/d67a2349-3eb7-47bf-b2b7-e52514f533f2.png" }
  ],
  luteal: [
    { id: "moodSwings", name: "Mood Swings", hp: 3, icon: "/lovable-uploads/2ece6e4e-6cc7-4707-9327-32fcd5ecb10d.png" },
    { id: "bloated", name: "Bloated", hp: 3, icon: "/lovable-uploads/38235581-e0fe-4a99-843a-cce1d98788b3.png" }
  ]
};

const phaseInfo = {
  menstruation: {
    name: "Level 1",
    subtitle: "MENSTRUATION",
    icon: Moon,
    color: "purple",
    background: "bg-menstruation-bg",
    description: "Time for rest and self-care",
    recommendedActivities: ["Gentle yoga", "Warm bath", "Meditation"],
    foodSuggestions: ["Iron-rich foods", "Warm herbal tea", "Dark chocolate"],
    statModifiers: {
      hunger: -0.5,
      hygiene: -0.3,
      energy: -1,
      happiness: -0.5
    }
  },
  follicular: {
    name: "Level 2",
    subtitle: "FOLLICULAR",
    icon: Leaf,
    color: "green",
    background: "bg-follicular-bg",
    description: "Rising energy and creativity",
    recommendedActivities: ["Strength training", "Brain games", "Social activities"],
    foodSuggestions: ["Protein-rich foods", "Fresh fruits", "Leafy greens"],
    statModifiers: {
      hunger: -0.3,
      hygiene: -0.4,
      energy: -0.2,
      happiness: -0.2
    }
  },
  ovulatory: {
    name: "Level 3",
    subtitle: "OVULATORY",
    icon: Sun,
    color: "yellow",
    background: "bg-ovulatory-bg",
    description: "Peak energy and confidence",
    recommendedActivities: ["Cardio", "Social games", "Creative projects"],
    foodSuggestions: ["Light meals", "Hydrating foods", "Colorful vegetables"],
    statModifiers: {
      hunger: -0.4,
      hygiene: -0.3,
      energy: -0.3,
      happiness: -0.1
    }
  },
  luteal: {
    name: "Level 4",
    subtitle: "LUTEAL",
    icon: Brain,
    color: "orange",
    background: "bg-luteal-bg",
    description: "Winding down and nesting",
    recommendedActivities: ["Gentle movement", "Stress relief", "Self-care"],
    foodSuggestions: ["Magnesium-rich foods", "Complex carbs", "Calming teas"],
    statModifiers: {
      hunger: -0.6,
      hygiene: -0.4,
      energy: -0.5,
      happiness: -0.6
    }
  }
};

const rooms = [
  { 
    id: "bedroom", 
    name: "Bedroom", 
    icon: Bed,
    background: "/lovable-uploads/a1bbe578-56c2-4388-a3b7-f149015540e4.png"
  },
  { 
    id: "bathroom", 
    name: "Bathroom", 
    icon: Bath,
    background: "/lovable-uploads/feda7f2a-d175-4797-9e49-f57732cd151a.png"
  },
  { 
    id: "kitchen", 
    name: "Kitchen", 
    icon: UtensilsCrossed,
    background: "/lovable-uploads/6b949a64-a128-4425-bd7d-de68fb3cacc3.png"
  },
  { 
    id: "exercise", 
    name: "Exercise Room", 
    icon: Dumbbell,
    background: "/lovable-uploads/647c4f54-a00f-4440-9f67-ed9a4cef9936.png"
  },
  { 
    id: "games", 
    name: "Game Room", 
    icon: Gamepad,
    background: "/lovable-uploads/4b783d28-54ae-4784-8b47-380bcbc178e7.png"
  },
  { 
    id: "workstation", 
    name: "Work Station", 
    icon: Laptop,
    background: "/lovable-uploads/38331f05-68ba-498a-9a0f-eafcd0ed1291.png"
  },
];

const roomBoosters = {
  kitchen: [
    {
      id: "fridge",
      type: "hunger" as const,
      icon: "/lovable-uploads/d2c58694-d998-412e-98ea-f07e05603033.png",
      boost: 15,
    }
  ],
  bathroom: [],
  bedroom: [
    {
      id: "book",
      type: "happiness" as const,
      icon: "/lovable-uploads/3f7be505-d8c4-43e8-b44e-92332022c3f1.png",
      boost: 15,
    }
  ],
  exercise: [
    {
      id: "yogamat",
      type: "energy" as const,
      icon: "/lovable-uploads/de0368a0-d48f-46c5-99c6-fec67d055986.png",
      boost: 20,
    }
  ],
  games: [],
  workstation: [],
};

const PouGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<Phase>("menstruation");
  const [stats, setStats] = useState({
    hunger: 75,
    hygiene: 90,
    energy: 60,
    happiness: 85,
    coins: 200
  });
  const [showBoostIndicator, setShowBoostIndicator] = useState(false);
  const [boostType, setBoostType] = useState<string>("");
  const [currentEnemies, setCurrentEnemies] = useState(enemies[currentPhase]);
  const [showDamage, setShowDamage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentEnemies(enemies[currentPhase]);
  }, [currentPhase]);

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

        Object.entries(newStats).forEach(([stat, value]) => {
          if (value < 20 && stat !== 'coins') {
            toast({
              title: `Low ${stat}!`,
              description: `Your Uteroo needs attention! ${stat} is getting low.`,
              variant: "destructive",
            });
          }
        });

        return newStats;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [currentPhase, toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData("itemType");
    const boost = Number(e.dataTransfer.getData("boost")) || 10;
    
    setStats(prev => {
      const newStats = { ...prev };
      switch (itemType) {
        case "hunger":
          newStats.hunger = Math.min(100, prev.hunger + boost);
          break;
        case "hygiene":
          newStats.hygiene = Math.min(100, prev.hygiene + boost);
          break;
        case "energy":
          newStats.energy = Math.min(100, prev.energy + boost);
          break;
        case "happiness":
          newStats.happiness = Math.min(100, prev.happiness + boost);
          break;
      }
      return newStats;
    });

    setShowDamage(itemType);
    setTimeout(() => setShowDamage(null), 1000);

    setBoostType(itemType);
    setShowBoostIndicator(true);
    setTimeout(() => setShowBoostIndicator(false), 1000);

    toast({
      title: "Boost Applied!",
      description: `Uteroo received a ${itemType} boost!`,
      duration: 2000,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const phase = phaseInfo[currentPhase];
  const PhaseIcon = phase.icon;

  const getProgressColor = (value: number) => {
    if (value > 66) return "bg-green-500";
    if (value > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleNextRoom = () => {
    setCurrentRoomIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  const handlePreviousRoom = () => {
    setCurrentRoomIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  const handlePhaseChange = (newPhase: Phase) => {
    setCurrentPhase(newPhase);
  };

  const currentRoom = rooms[currentRoomIndex];
  const RoomIcon = currentRoom.icon;
  const currentRoomBoosters = roomBoosters[currentRoom.id as keyof typeof roomBoosters] || [];

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ 
          backgroundImage: currentRoom.background 
            ? `url('${currentRoom.background}')`
            : "url('/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png')",
          backgroundSize: 'cover',
          imageRendering: 'pixelated'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-white/30 p-4 shadow-md backdrop-blur-sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center">{phase.name}</h1>
            <h2 className="text-xl font-semibold text-center mb-2">{phase.subtitle}</h2>
            <div className="flex justify-center gap-2 px-4">
              {(Object.keys(phaseInfo) as Phase[]).map((phaseName) => {
                const PhaseIconComponent = phaseInfo[phaseName].icon;
                return (
                  <Button
                    key={phaseName}
                    variant={currentPhase === phaseName ? "default" : "outline"}
                    onClick={() => handlePhaseChange(phaseName)}
                    className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                  >
                    <PhaseIconComponent className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">{phaseName.charAt(0).toUpperCase() + phaseName.slice(1)}</span>
                    <span className="sm:hidden">{phaseName.charAt(0).toUpperCase()}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="fixed top-32 left-0 right-0 bg-white/30 p-4 shadow-md backdrop-blur-sm">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-sm font-bold">{stats.coins}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 flex-1 max-w-xs mx-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Apple className="w-4 h-4 text-orange-500 animate-pulse" />
                  </div>
                  <Progress 
                    value={stats.hunger} 
                    className="h-2 transition-all duration-500"
                    indicatorClassName={getProgressColor(stats.hunger)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-blue-500 animate-pulse" />
                  </div>
                  <Progress 
                    value={stats.hygiene} 
                    className="h-2 transition-all duration-500"
                    indicatorClassName={getProgressColor(stats.hygiene)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <BatteryFull className="w-4 h-4 text-green-500 animate-pulse" />
                  </div>
                  <Progress 
                    value={stats.energy} 
                    className="h-2 transition-all duration-500"
                    indicatorClassName={getProgressColor(stats.energy)}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  </div>
                  <Progress 
                    value={stats.happiness} 
                    className="h-2 transition-all duration-500"
                    indicatorClassName={getProgressColor(stats.happiness)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed top-44 left-0 right-0 bg-white/30 p-4 shadow-md backdrop-blur-sm">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousRoom}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <RoomIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">{currentRoom.name}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextRoom}
              className="hover:bg-gray-100"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 pt-64">
          <div 
            className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-[60vh]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-8">
              {currentEnemies.map((enemy) => (
                <div key={enemy.id} className="relative flex flex-col items-center">
                  <img 
                    src={enemy.icon} 
                    alt={enemy.name}
                    className="w-20 h-20 object-contain pixelated"
                  />
                  <span className="text-sm font-bold mt-2">{enemy.name}</span>
                  {showDamage && (
                    <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-red-500 font-bold animate-bounce">
                      -1 HP
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <UterooCharacter phase={currentPhase} />
                {showBoostIndicator && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce text-lg font-bold text-green-500">
                    +1 {boostType}!
                  </div>
                )}
              </div>
            </div>

            {currentRoomBoosters.length > 0 && (
              <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white/5 p-6 rounded-xl w-[90%] max-w-2xl">
                <div className="flex gap-4 justify-center">
                  {currentRoomBoosters.map((item) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      type={item.type}
                      icon={item.icon}
                      boost={item.boost}
                      onDrop={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentRoom.id === "kitchen" && (
              <div className="absolute bottom-4 right-4">
                <GroceryList phase={currentPhase} />
              </div>
            )}
          </div>

          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
            <Button 
              variant="outline" 
              className="w-full hover:scale-105 transition-transform duration-300"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PouGame;
