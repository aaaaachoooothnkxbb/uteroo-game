import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Apple,
  Bath,
  Bed,
  Gamepad,
  ShoppingBag,
  Heart,
  Droplet,
  BatteryFull,
  Home,
  Dumbbell,
  Brain,
  Moon,
  Sun,
  Leaf
} from "lucide-react";
import { UterooCharacter } from "@/components/UterooCharacter";
import { useToast } from "@/hooks/use-toast";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseInfo = {
  menstruation: {
    name: "Menstruation Flatland",
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
    name: "Follicular Uphill",
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
    name: "Ovulatory Mountain",
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
    name: "Luteal Hill",
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
  },
};

const rooms = [
  { id: "living", name: "Living Room", icon: Home },
  { id: "kitchen", name: "Kitchen", icon: Apple },
  { id: "bathroom", name: "Bathroom", icon: Bath },
  { id: "bedroom", name: "Bedroom", icon: Bed },
  { id: "exercise", name: "Exercise", icon: Dumbbell },
  { id: "games", name: "Game Room", icon: Gamepad },
  { id: "shop", name: "Shop", icon: ShoppingBag },
];

const PouGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentRoom, setCurrentRoom] = useState("living");
  const [currentPhase, setCurrentPhase] = useState<Phase>("menstruation");
  const [stats, setStats] = useState({
    hunger: 75,
    hygiene: 90,
    energy: 60,
    happiness: 85,
    coins: 200
  });

  // Effect to deplete stats based on current phase
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

        // Check if any stat is critically low
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
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [currentPhase, toast]);

  const phase = phaseInfo[currentPhase];
  const PhaseIcon = phase.icon;

  const getProgressColor = (value: number) => {
    if (value > 66) return "bg-green-500";
    if (value > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png')",
          backgroundSize: 'cover',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Content Container with backdrop blur */}
      <div className="relative z-10 min-h-screen">
        {/* Top Bar - Stats */}
        <div className="bg-white/90 p-4 shadow-md backdrop-blur-sm">
          <div className="max-w-md mx-auto flex items-center justify-between">
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

        {/* Phase Information */}
        <div className="max-w-md mx-auto mt-4 px-4">
          <div className={`${phase.background} backdrop-blur-sm rounded-lg p-4 shadow-md animate-fade-in`}>
            <div className="flex items-center gap-2 mb-2">
              <PhaseIcon className={`w-5 h-5 text-${currentPhase}-primary animate-pulse`} />
              <h3 className={`text-${currentPhase}-primary font-medium`}>{phase.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{phase.description}</p>
          </div>
        </div>

        {/* Main Character Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-[60vh]">
          <div className="absolute inset-0 flex items-center justify-center">
            <UterooCharacter phase={currentPhase} />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white/90 p-4 shadow-md backdrop-blur-sm">
          <div className="max-w-md mx-auto grid grid-cols-4 sm:grid-cols-7 gap-2">
            {rooms.map((room) => {
              const Icon = room.icon;
              return (
                <Button
                  key={room.id}
                  variant={currentRoom === room.id ? "default" : "ghost"}
                  className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                    currentRoom === room.id ? 'scale-110' : 'hover:scale-105'
                  }`}
                  onClick={() => setCurrentRoom(room.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{room.name}</span>
                </Button>
              );
            })}
          </div>
          <div className="max-w-md mx-auto mt-4">
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