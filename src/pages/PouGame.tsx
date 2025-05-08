import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Apple, Bath, Bed, Gamepad, 
  ShoppingBag, Heart, Droplet, BatteryFull, 
  Home, Dumbbell, Brain, Moon, Sun, Leaf, UtensilsCrossed, Laptop, Beaker,
  Flame, HelpCircle, Calendar, CoinsIcon
} from "lucide-react";
import { UterooCharacter } from "@/components/UterooCharacter";
import { useToast } from "@/hooks/use-toast";
import { DraggableItem } from "@/components/DraggableItem";
import { GroceryList } from "@/components/GroceryList";
import { YogaPoseModal } from "@/components/YogaPoseModal";
import { ProductivityTipsModal } from "@/components/ProductivityTipsModal";
import { JournalingModal } from "@/components/JournalingModal";
import { BloodworkModal } from "@/components/BloodworkModal";
import { UterooTutorial } from "@/components/UterooTutorial";
import { CycleSanctuary } from "@/components/CycleSanctuary";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { RecipeRoulette } from "@/components/RecipeRoulette";
import { PhaseRecipeRoulette } from "@/components/PhaseRecipeRoulette";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PhaseVideos } from "@/components/PhaseVideos";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

// Define the FloatingHeart interface
interface FloatingHeart {
  id: string;
  x: number; // x position offset
  y: number; // y position offset
}

// Science-backed boosters data
const scienceBoosters = {
  bedroom: [
    {
      id: "red_light",
      name: "Red Light Therapy",
      type: "energy" as const,
      icon: "/lovable-uploads/5456ad76-fc4d-41bf-af80-f17afa7e0ff8.png",
      boost: 25,
      cost: 30,
      costType: "hearts" as const,
      tooltip: {
        title: "Red Light Therapy",
        description: "Scientific studies show that red light therapy can reduce menstrual pain by improving blood circulation and reducing inflammation.",
        learnMoreUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7003061/"
      }
    }
  ],
  bathroom: [
    {
      id: "epsom_salt",
      name: "Epsom Salt Soak",
      type: "hygiene" as const,
      icon: "/lovable-uploads/861f1be0-201e-4269-be4e-3b74dbb8e136.png",
      boost: 20,
      cost: 20,
      costType: "hearts" as const,
      tooltip: {
        title: "Epsom Salt Soak",
        description: "Magnesium in Epsom salts can be absorbed through the skin and may help reduce cramps by relaxing smooth muscle tissue.",
        learnMoreUrl: "https://www.medicalnewstoday.com/articles/epsom-salt-for-pain"
      }
    }
  ],
  games: [
    {
      id: "dance_breaks",
      name: "Dance Breaks",
      type: "happiness" as const,
      icon: "/lovable-uploads/c00b6791-8007-435f-a0fd-63104a0d898b.png",
      boost: 25,
      cost: 15,
      costType: "hearts" as const,
      tooltip: {
        title: "Dance Breaks",
        description: "Dancing triggers endorphin release, which can help alleviate menstrual pain and boost mood naturally.",
        learnMoreUrl: "https://www.sciencedirect.com/science/article/abs/pii/S0965229919308040"
      }
    }
  ],
  workstation: [
    {
      id: "pomodoro_timer",
      name: "Pomodoro Timer",
      type: "energy" as const,
      icon: "/lovable-uploads/959696ca-9468-41f5-92f4-34af0b40294b.png",
      boost: 20,
      cost: 25,
      costType: "hearts" as const,
      tooltip: {
        title: "Pomodoro Timer",
        description: "The Pomodoro Technique helps balance cortisol levels by preventing burnout and maintaining focus during different phases of your cycle.",
        learnMoreUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6999883/"
      }
    }
  ],
  exercise: [
    {
      id: "pms_yoga",
      name: "Yoga for PMS",
      type: "energy" as const,
      icon: "/lovable-uploads/de0368a0-d48f-46c5-99c6-fec67d055986.png",
      boost: 30,
      cost: 30,
      costType: "hearts" as const,
      onClick: (currentPhase: string, openYogaPoses: () => void) => openYogaPoses(),
      tooltip: {
        title: "Yoga for PMS",
        description: "Specific yoga poses can help relieve bloating and cramps by improving circulation to the pelvic region and releasing tension.",
        learnMoreUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6746411/"
      }
    }
  ],
  lab: [
    {
      id: "cycle_analytics",
      name: "Cycle Analytics",
      type: "energy" as const,
      icon: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png",
      boost: 35,
      cost: 50,
      costType: "hearts" as const,
      bloodworkAnalysis: true,
      tooltip: {
        title: "Cycle Analytics",
        description: "Advanced hormone tracking can help predict symptoms and optimize lifestyle choices based on your unique cycle patterns.",
        learnMoreUrl: "https://www.tandfonline.com/doi/abs/10.1080/03007995.2016.1215413"
      }
    }
  ],
};

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

const phaseInfo = {
  menstruation: {
    name: "Level 1",
    subtitle: "MENSTRUATION",
    icon: Moon,
    emoji: "🌸",
    color: "purple",
    nextPhase: "follicular",
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
    emoji: "🌱",
    color: "green",
    nextPhase: "ovulatory",
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
    emoji: "☀️",
    color: "yellow",
    nextPhase: "luteal",
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
    emoji: "🍂",
    color: "orange",
    nextPhase: "menstruation",
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
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "bathroom", 
    name: "Bathroom", 
    icon: Bath,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "kitchen", 
    name: "Kitchen", 
    icon: UtensilsCrossed,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "exercise", 
    name: "Exercise Room", 
    icon: Dumbbell,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "games", 
    name: "Game Room", 
    icon: Gamepad,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "workstation", 
    name: "Work Station", 
    icon: Laptop,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "shop", 
    name: "Shop", 
    icon: ShoppingBag,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "lab", 
    name: "The Lab", 
    icon: Beaker,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
  { 
    id: "cycle_sanctuary", 
    name: "Cycle Sanctuary", 
    icon: Calendar,
    background: "/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png"
  },
];

const roomBoosters = {
  kitchen: [
    {
      id: "fridge",
      name: "Healthy Snacks",
      type: "hunger" as const,
      icon: "/lovable-uploads/d2c58694-d998-412e-98ea-f07e05603033.png",
      boost: 15,
      tooltip: {
        title: "Nutrición en tu ciclo",
        description: "Los alimentos ricos en hierro y proteínas son especialmente importantes durante la menstruación para reponer los nutrientes perdidos.",
        learnMoreUrl: "https://www.healthline.com/health/womens-health/menstrual-cycle-diet"
      }
    },
    {
      id: "phase_recipe",
      name: "Phase Recipe",
      type: "hunger" as const,
      isPhaseRecipe: true,
      boost: 20,
      tooltip: {
        title: "Recetas para tu fase",
        description: "Recetas adaptadas a tus necesidades nutricionales específicas según tu fase del ciclo menstrual.",
      }
    }
  ],
  bathroom: [
    {
      id: "facemask",
      name: "Self-Care Routine",
      type: "hygiene" as const,
      icon: "/lovable-uploads/861f1be0-201e-4269-be4e-3b74dbb8e136.png",
      boost: 20,
      tooltip: {
        title: "Auto-cuidado hormonal",
        description: "Los rituales de cuidado personal ayudan a reducir el cortisol (hormona del estrés) que puede desequilibrar tus niveles hormonales.",
        learnMoreUrl: "https://www.medicalnewstoday.com/articles/322317"
      }
    }
  ],
  bedroom: [
    {
      id: "book",
      name: "Reading Time",
      type: "happiness" as const,
      icon: "/lovable-uploads/3f7be505-d8c4-43e8-b44e-92332022c3f1.png",
      boost: 15,
      tooltip: {
        title: "Descanso mental",
        description: "La lectura antes de dormir reduce los niveles de cortisol y mejora la calidad del sueño, especialmente importante durante la fase lútea."
      }
    },
    {
      id: "journal",
      name: "Daily Journaling",
      type: "happiness" as const,
      icon: "/lovable-uploads/db737ae2-ab52-4d61-af92-95a81616243d.png",
      boost: 15,
      journalingItem: true,
      tooltip: {
        title: "Seguimiento emocional",
        description: "Escribir sobre tus emociones ayuda a identificar patrones relacionados con tu ciclo hormonal y a desarrollar estrategias de afrontamiento."
      }
    },
    {
      id: "affirmations",
      name: "Affirmation Playlist",
      type: "happiness" as const,
      icon: "/lovable-uploads/0d952487-7b39-49f2-b2d5-7a34cfcd37da.png",
      boost: 20,
      onClick: () => window.open('https://open.spotify.com/intl-es/album/2ptz0mo135CScaIxz3Fz7q?si=dd_BEvOpRa6nYjIuHsuNDQ', '_blank'),
      tooltip: {
        description: "Las afirmaciones positivas pueden ayudar a equilibrar los cambios de humor relacionados con las fluctuaciones de estrógeno y progesterona."
      }
    }
  ],
  exercise: [
    {
      id: "yogamat",
      name: "Yoga Session",
      type: "energy" as const,
      icon: "/lovable-uploads/de0368a0-d48f-46c5-99c6-fec67d055986.png",
      boost: 20,
      onClick: (currentPhase: string, openYogaPoses: () => void) => openYogaPoses(),
      tooltip: {
        title: "Yoga hormonal",
        description: "Ciertas posturas de yoga pueden ayudar a aliviar los cólicos menstruales al reducir la inflamación y mejorar el flujo sanguíneo en la región pélvica.",
        learnMoreUrl: "https://www.healthline.com/health/yoga-for-menstrual-cramps"
      }
    },
    {
      id: "meditation",
      name: "Meditation Session",
      type: "happiness" as const,
      icon: "/lovable-uploads/c00b6791-8007-435f-a0fd-63104a0d898b.png",
      boost: 25,
      meditationPlaylist: true,
      tooltip: {
        title: "Meditación y hormonas",
        description: "La meditación regular puede reducir los niveles de cortisol y aumentar la serotonina, ayudando a equilibrar las fluctuaciones hormonales durante tu ciclo."
      }
    }
  ],
  games: [],
  workstation: [
    {
      id: "calendar",
      name: "Schedule Planning",
      type: "energy" as const,
      icon: "/lovable-uploads/959696ca-9468-41f5-92f4-34af0b40294b.png",
      boost: 15,
      onClick: () => window.open('https://docs.google.com/spreadsheets/d/1FcwVQGfEp9t6u00AUhgIr5wjmTwMXe2kIb3eWQbiq5o/edit?gid=0#gid=0', '_blank'),
      tooltip: {
        description: "Planificar actividades según tu fase del ciclo puede ayudarte a aprovechar tus fluctuaciones de energía naturales."
      }
    },
    {
      id: "productivity_tips",
      name: "Productivity Tips",
      type: "energy" as const,
      icon: "/lovable-uploads/8a96a5ad-54d1-431d-816c-aaf25e1a3a99.png",
      boost: 20,
      onClick: (currentPhase: string, openProductivityTips: () => void) => openProductivityTips(),
      tooltip: {
        title: "Productividad cíclica",
        description: "Tu productividad varía naturalmente con tu ciclo hormonal. Aprovecha la fase folicular para iniciar proyectos y la fase lútea para tareas detalladas."
      }
    }
  ],
  shop: [
    {
      id: "energy_potion",
      name: "Energy Potion",
      type: "energy" as const,
      icon: "/lovable-uploads/c5a3a3fe-1f7c-43fd-af31-47b307feb425.png",
      boost: 30,
      cost: 50,
      tooltip: {
        title: "Impulso energético",
        description: "La fatiga durante la menstruación se debe a la pérdida de hierro. Los suplementos naturales pueden ayudar a reponer tus niveles de energía."
      }
    },
    {
      id: "happiness_crystal",
      name: "Happiness Crystal",
      type: "happiness" as const,
      icon: "/lovable-uploads/79e01f75-20fb-4814-a2d3-219a420a385b.png",
      boost: 25,
      cost: 40,
      tooltip: {
        description: "Los cambios de humor pueden ser causados por fluctuaciones en los niveles de serotonina durante tu ciclo. Ciertas actividades pueden ayudar a estabilizarla."
      }
    },
    {
      id: "hygiene_kit",
      name: "Hygiene Kit",
      type: "hygiene" as const,
      icon: "/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png",
      boost: 35,
      cost: 45,
      tooltip: {
        title: "Cuidado íntimo",
        description: "El pH vaginal cambia durante tu ciclo. Es importante usar productos suaves y naturales, especialmente durante la menstruación."
      }
    }
  ],
  lab: [
    {
      id: "bloodwork",
      name: "Upload Bloodwork",
      type: "energy" as const,
      icon: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png",
      boost: 25,
      bloodworkAnalysis: true,
      tooltip: {
        title: "Análisis hormonal",
        description: "Conocer tus niveles hormonales puede ayudarte a entender mejor tu ciclo y cualquier síntoma inusual que puedas experimentar.",
        learnMoreUrl: "https://helloclue.com/articles/cycle-a-z/hormone-levels-throughout-your-menstrual-cycle"
      }
    }
  ],
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
    coins: 200,
    hearts: 0  // Added hearts as a new stat
  });
  const [streak, setStreak] = useState(0);
  const [lastBoosterUsed, setLastBoosterUsed] = useState<string | null>(null);
  const [showBoostIndicator, setShowBoostIndicator] = useState(false);
  const [boostType, setBoostType] = useState<string>("");
  const [currentEnemies, setCurrentEnemies] = useState(enemies[currentPhase]);
  const [showDamage, setShowDamage] = useState<string | null>(null);
  const [showYogaPoses, setShowYogaPoses] = useState(false);
  const [yogaPoses, setYogaPoses] = useState<any[]>([]);
  const [showProductivityTips, setShowProductivityTips] = useState(false);
  const [showJournalingModal, setShowJournalingModal] = useState(false);
  const [showBloodworkModal, setShowBloodworkModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [heartClicks, setHeartClicks] = useState(0);
  const [consecutiveClicks, setConsecutiveClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showHeartBonus, setShowHeartBonus] = useState(false);
  
  // Load streak from localStorage on component mount
  useEffect(() => {
    const savedStreak = localStorage.getItem('uterooStreak');
    const lastUsedTimestamp = localStorage.getItem('lastBoosterTimestamp');
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
    
    // Reset streak if it's been more than 24 hours since last booster use
    if (lastUsedTimestamp) {
      const lastUsed = new Date(lastUsedTimestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        setStreak(0);
        localStorage.setItem('uterooStreak', '0');
      }
    }
  }, []);

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

  useEffect(() => {
    const fetchYogaPoses = async () => {
      const { data, error } = await supabase
        .from('yoga_poses')
        .select('*')
        .eq('phase', currentPhase);
      
      if (error) {
        console.error('Error fetching yoga poses:', error);
        toast({
          title: "Error",
          description: "Could not load yoga poses",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setYogaPoses(data);
      }
    };

    if (showYogaPoses) {
      fetchYogaPoses();
    }
  }, [currentPhase, showYogaPoses, toast]);

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
          newStats.hygiene = Math.max(0, prev.hygiene + boost);
          break;
        case "energy":
          newStats.energy = Math.max(0, prev.energy + boost);
          break;
        case "happiness":
          newStats.happiness = Math.max(0, prev.happiness + boost);
          break;
      }
      return newStats;
    });

    // Update streak when item is dropped on character
    updateStreak();

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

  // Update streak counter
  const updateStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('uterooStreak', newStreak.toString());
    localStorage.setItem('lastBoosterTimestamp', new Date().toISOString());
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

  const handleBoosterClick = (booster: any) => {
    if (booster.journalingItem) {
      setShowJournalingModal(true);
      // Don't count journaling as streak until completed
      return;
    }
    
    if (booster.bloodworkAnalysis) {
      setShowBloodworkModal(true);
      // Update streak when bloodwork is analyzed
      updateStreak();
      return;
    }
    
    // Update streak when booster is clicked
    updateStreak();
    
    if (booster.onClick) {
      if (booster.id === "yogamat") {
        booster.onClick(currentPhase, () => setShowYogaPoses(true));
      } else if (booster.id === "productivity_tips") {
        booster.onClick(currentPhase, () => setShowProductivityTips(true));
      } else if (booster.id === "affirmations") {
        booster.onClick();
      }
    }

    if (booster.cost) {
      if (stats.coins < booster.cost) {
        toast({
          title: "Not enough coins!",
          description: `You need ${booster.cost} coins to buy ${booster.name}`,
          variant: "destructive",
        });
        return;
      }

      setStats(prev => ({
        ...prev,
        coins: prev.coins - booster.cost
      }));

      toast({
        title: `${booster.name} purchased!`,
        description: `You spent ${booster.cost} coins`,
      });
    }
    
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
      title: `${booster.name} used!`,
      description: `Gained ${booster.boost} ${booster.type} points!`,
    });
  };

  // Add enemies tooltip information
  const getEnemyTooltip = (enemyId: string) => {
    const tooltips: Record<string, {title: string, description: string}> = {
      "cramps": {
        title: "Cólicos menstruales", 
        description: "Los cólicos son causados por prostaglandinas, que hacen que el útero se contraiga. Los boosters de calor y ciertos estiramientos pueden aliviarlos."
      },
      "fatigue": {
        title: "Fatiga menstrual", 
        description: "La fatiga durante la menstruación se debe principalmente a la pérdida de hierro. Descansar y consumir alimentos ricos en hierro puede ayudar."
      },
      "anxiety": {
        title: "Ansiedad hormonal", 
        description: "Los cambios en los niveles de estrógeno pueden afectar los neurotransmisores que regulan el estado de ánimo. La meditación y respiración profunda son útiles."
      },
      "migraine": {
        title: "Migraña menstrual", 
        description: "Las migrañas pueden ser desencadenadas por la caída de estrógeno antes de la menstruación. La hidratación y evitar desencadenantes ayuda a prevenirlas."
      },
      "sensitivity": {
        title: "Sensibilidad aumentada", 
        description: "El aumento de progesterona puede causar mayor sensibilidad emocional. Es normal y puede ser una buena oportunidad para la introspección."
      },
      "irritability": {
        title: "Irritabilidad premenstrual", 
        description: "La fluctuación del estrógeno y la progesterona puede afectar los niveles de serotonina, causando irritabilidad. El ejercicio moderado puede ayudar."
      },
      "sadness": {
        title: "Tristeza premenstrual", 
        description: "Los cambios hormonales pueden afectar los neurotransmisores relacionados con el estado de ánimo. El autocuidado y el apoyo social son importantes."
      }
    };

    return tooltips[enemyId] || null;
  };

  // Simplified enemy rendering for symptom cards
  const renderSymptomCards = () => {
    if (currentEnemies.length === 0) return null;
    
    return (
      <div className="flex gap-3 mb-4 overflow-x-auto pb-2 snap-x">
        {currentEnemies.map((enemy) => (
          <Card 
            key={enemy.id} 
            className={cn(
              "relative p-3 bg-white/80 backdrop-blur-md shadow-sm border-l-4 rounded-lg snap-center flex-shrink-0",
              "min-w-[140px] max-w-[160px]",
              enemy.id === "cramps" || enemy.id === "fatigue" ? "border-l-red-500" :
              enemy.id === "anxiety" || enemy.id === "migraine" ? "border-l-yellow-500" :
              "border-l-orange-500"
            )}
          >
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="w-9 h-9 flex-shrink-0">
                      <img 
                        src={enemy.icon} 
                        alt={enemy.name}
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-wider">{enemy.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="text-xs">→</span>
                        <span>{enemy.suggestion}</span>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="max-w-[200px] p-3 bg-white/95 backdrop-blur-sm text-left z-50"
                >
                  {getEnemyTooltip(enemy.id) ? (
                    <>
                      <h4 className="font-semibold mb-1 text-xs">{getEnemyTooltip(enemy.id)?.title}</h4>
                      <p className="text-xs">{getEnemyTooltip(enemy.id)?.description}</p>
                    </>
                  ) : (
                    <p className="text-xs">Este síntoma está relacionado con los cambios hormonales de tu ciclo.</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Card>
        ))}
      </div>
    );
  };

  // Enhanced phase progress indicator - completely redesigned
  const renderPhaseProgress = () => {
    // This is a simplified version - in a real implementation, you'd calculate actual days
    const currentDay = 2; // Assuming day 2 of the phase for demonstration
    const phaseDuration = 7; // Assuming 7 days per phase for demonstration
    const nextPhase = phase.nextPhase as Phase;
    const nextPhaseInfo = phaseInfo[nextPhase];
    
    return (
      <div className="mx-auto max-w-xs">
        <div className="flex items-center mb-1 justify-between">
          <div className="flex items-center">
            <span className="mr-1 text-xl">{phase.emoji}</span>
            <h2 className={cn(
              "text-base font-bold tracking-wider uppercase",
              currentPhase === "menstruation" ? "text-pink-600" :
              currentPhase === "follicular" ? "text-green-600" :
              currentPhase === "ovulatory" ? "text-yellow-600" :
              "text-orange-600"
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
              currentPhase === "menstruation" ? "bg-pink-500" :
              currentPhase === "follicular" ? "bg-green-500" :
              currentPhase === "ovulatory" ? "bg-yellow-500" :
              "bg-orange-500"
            )}
            className="h-2 rounded-full bg-gray-200"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start pointer-events-none">
            <div 
              className={cn(
                "h-4 w-4 rounded-full border-2 bg-white shadow-md absolute",
                currentPhase === "menstruation" ? "border-pink-600" :
                currentPhase === "follicular" ? "border-green-600" :
                currentPhase === "ovulatory" ? "border-yellow-600" :
                "border-orange-600"
              )}
              style={{left: `${(currentDay/phaseDuration) * 100}%`, transform: 'translateX(-50%)'}}
            />
          </div>
          <div className="flex justify-end mt-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-gray-600 gap-1 bg-white/80 px-2 py-0.5 rounded-full">
                  <span>⬤</span>
                  <span>Next: {nextPhaseInfo.subtitle} in {phaseDuration - currentDay}d</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white p-2">
                <p>Your cycle will progress to {nextPhaseInfo.subtitle} in {phaseDuration - currentDay} days</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  // Render science-based boosters for current room
  const renderScienceBoosters = () => {
    const currentRoom = rooms[currentRoomIndex];
    const scienceBoostersForRoom = scienceBoosters[currentRoom.id as keyof typeof scienceBoosters] || [];
    
    if (scienceBoostersForRoom.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm flex items-center gap-1">
            <span>Science Boosters</span>
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">New!</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {scienceBoostersForRoom.map((booster) => (
            <TooltipProvider key={booster.id}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div 
                    onClick={() => handleBoosterClick(booster)}
                    className="flex flex-col items-center p-2 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img 
                        src={booster.icon} 
                        alt={booster.name}
                        className="w-12 h-12 object-contain mb-1 animate-pulse-slow"
                      />
                      <div className="absolute -top-1 -right-1 flex items-center gap-0.5 bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 font-semibold shadow-sm">
                        <Heart className="h-3 w-3" />
                        <span>{booster.cost}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-center">{booster.name}</span>
                    <div className="text-2xs text-purple-700 mt-1">🧪 Science-based</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/95 backdrop-blur-sm p-3 max-w-[250px]">
                  <h4 className="font-semibold mb-1">{booster.tooltip?.title}</h4>
                  <p className="text-xs">{booster.tooltip?.description}</p>
                  {booster.tooltip?.learnMoreUrl && (
                    <a 
                      href={booster.tooltip.learnMoreUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-2xs text-purple-700 mt-1 underline block"
                    >
                      Read scientific research
                    </a>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  };

  // Completely redesigned compact stats panel with hearts
  const renderStatsPanel = () => {
    return (
      <div className="max-w-md mx-auto mt-2 mb-4">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
          {/* Heart counter - now more prominent */}
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
            <span className="text-sm font-semibold">{stats.hearts}</span>
          </div>
          
          {/* Coins counter */}
          <div className="flex items-center gap-1">
            <CoinsIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-semibold">{stats.coins}</span>
          </div>
          
          {/* Streak counter */}
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-semibold">{streak}d</span>
          </div>
          
          {/* Other stats (only visible on larger screens) */}
          <div className="hidden sm:flex items-center gap-1">
            <div className="w-1 h-6 border-r border-gray-300"></div>
            <Apple className="h-3 w-3 text-red-500" />
            <Progress 
              value={stats.hunger} 
              className="h-1 w-8 rounded-full"
              indicatorClassName={cn(getProgressColor(stats.hunger))}
              size="xs"
            />
            
            <Droplet className="h-3 w-3 text-blue-500 ml-1" />
            <Progress 
              value={stats.hygiene} 
              className="h-1 w-8 rounded-full"
              indicatorClassName={cn(getProgressColor(stats.hygiene))}
              size="xs"
            />
          </div>
        </div>
      </div>
    );
  };

  // Handle click on Uteroo character to add hearts
  const handleUterooClick = useCallback(() => {
    const now = Date.now();
    let heartsToAdd = 1;
    
    // Check if this is a consecutive click (within 2 seconds of last click)
    if (now - lastClickTime < 2000) {
      const newConsecutiveClicks = consecutiveClicks + 1;
      setConsecutiveClicks(newConsecutiveClicks);
      
      // Award bonus hearts for 10+ consecutive clicks
      if (newConsecutiveClicks >= 10) {
        heartsToAdd = 5;
        setShowHeartBonus(true);
        setTimeout(() => setShowHeartBonus(false), 2000);
        
        // Play celebration sound
        const audio = new Audio('/lovable-uploads/52bb0557-2423-47d1-9bfb-2c0316ac26ce.png'); // This is just a placeholder, you'd need to add an actual sound file
        audio.play().catch(e => console.log("Audio play failed:", e));
        
        // Reset consecutive clicks after bonus
        setConsecutiveClicks(0);
      }
    } else {
      // Reset consecutive clicks if too much time has passed
      setConsecutiveClicks(1);
    }
    
    setLastClickTime(now);
    
    // Increment hearts
    setStats(prev => ({
      ...prev,
      hearts: prev.hearts + heartsToAdd
    }));
    
    // Create a new floating heart
    const newHeart: FloatingHeart = {
      id: `heart-${Date.now()}-${Math.random()}`,
      x: Math.random() * 40 - 20, // Random offset for x position
      y: -20 - Math.random() * 30, // Start position above character
    };
    
    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Remove the heart after animation completes
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
    }, 1500);
    
    // Show toast for hearts earned
    toast({
      title: `+${heartsToAdd} Heart${heartsToAdd > 1 ? 's' : ''}!`,
      description: heartsToAdd > 1 ? "Bonus hearts for quick clicks!" : "Hearts = love for yourself! Spend them to feel better. 💖",
      duration: 1500,
    });
  }, [heartClicks, toast, consecutiveClicks, lastClickTime]);

  return (
    <div className="min-h-screen relative">
      
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ 
          backgroundImage: currentRoom.background 
            ? `url('${currentRoom.background}')`
            : "url('/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png')",
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
        {/* Streamlined header */}
        <div className="fixed top-0 left-0 right-0 bg-white/60 shadow-sm backdrop-blur-sm z-30 pt-4 pb-2 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-full bg-white/80 hover:bg-white shadow-sm h-8 w-8 p-0"
                onClick={() => setShowTutorial(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2">
                {(Object.keys(phaseInfo) as Phase[]).map((phaseName) => {
                  const PhaseIconComponent = phaseInfo[phaseName].icon;
                  return (
                    <Button
                      key={phaseName}
                      variant={currentPhase === phaseName ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePhaseChange(phaseName)}
                      className={cn(
                        "w-8 h-8 p-0 rounded-full",
                        currentPhase === phaseName && 
                          (phaseName === "menstruation" ? "bg-pink-500 border-pink-300" :
                           phaseName === "follicular" ? "bg-green-500 border-green-300" :
                           phaseName === "ovulatory" ? "bg-yellow-500 border-yellow-300" :
                           "bg-orange-500 border-orange-300")
                      )}
                    >
                      <PhaseIconComponent className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {renderPhaseProgress()}
          </div>
        </div>

        {/* Main content area with better spacing and sizing */}
        <div className="flex-1 pt-28 pb-6 px-4">
          <div className="max-w-md mx-auto">
            {/* Improved room navigation - adding more top margin (mt-6) to push it down */}
            <div className="flex justify-between items-center mb-4 mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousRoom}
                className="bg-white/80 hover:bg-white h-8 w-8 p-0 rounded-full shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous Room</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <RoomIcon className={cn(
                    "h-4 w-4",
                    currentPhase === "menstruation" ? "text-pink-500" :
                    currentPhase === "follicular" ? "text-green-500" :
                    currentPhase === "ovulatory" ? "text-yellow-500" :
                    "text-orange-500"
                  )} />
                  <h2 className="text-sm font-medium">{currentRoom.name}</h2>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/80 hover:bg-white h-8 w-8 p-0 rounded-full shadow-sm"
                    >
                      <span className="sr-only">Show rooms</span>
                      <svg xmlns="http://www3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-sm shadow-md border-0 rounded-lg">
                    {rooms.map((room, index) => {
                      const IconComponent = room.icon;
                      return (
                        <DropdownMenuItem 
                          key={room.id}
                          onClick={() => setCurrentRoomIndex(index)}
                          className={cn(
                            "flex items-center gap-2 cursor-pointer",
                            currentRoomIndex === index && "bg-gray-100 font-medium"
                          )}
                        >
                          <IconComponent className="h-4 w-4" />
                          {room.name}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextRoom}
                className="bg-white/80 hover:bg-white h-8 w-8 p-0 rounded-full shadow-sm"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next Room</span>
              </Button>
            </div>
            
            {/* Stats panel moved here - below the room bar */}
            {renderStatsPanel()}
            
            {/* Character area with improved centering and click handler */}
            <div 
              className="relative flex justify-center mb-4 mx-auto"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Heart bonus indicator */}
              {showHeartBonus && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-bold animate-bounce-slow z-20">
                  +5 Hearts Bonus! 💗
                </div>
              )}
              
              {/* Floating hearts animation */}
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
                phase={currentPhase} 
                currentRoom={currentRoom.id} 
                size="large" 
                minimal={false} 
                onClick={handleUterooClick}
              />
              
              {showBoostIndicator && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white animate-boost z-20">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full shadow-lg",
                    boostType === "hunger" ? "bg-red-500" :
                    boostType === "hygiene" ? "bg-blue-500" :
                    boostType === "energy" ? "bg-green-500" :
                    "bg-pink-500"
                  )}>
                    +{boostType}!
                  </span>
                </div>
              )}
            </div>
            
            {/* Symptoms section */}
            {renderSymptomCards()}
            
            {/* Continue streak button */}
            <Button 
              className={cn(
                "w-full mb-4 shadow-sm border-0 bg-gradient-to-r text-sm",
                currentPhase === "menstruation" ? "from-pink-500 to-pink-400" :
                currentPhase === "follicular" ? "from-green-500 to-green-400" :
                currentPhase === "ovulatory" ? "from-yellow-500 to-yellow-400" :
                "from-orange-500 to-orange-400"
              )}
              onClick={() => updateStreak()}
            >
              <Flame className="h-4 w-4 mr-1" />
              <span>🔥 {streak}-Day Streak • Continue (+10 pts)</span>
            </Button>
            
            {/* Science boosters */}
            {renderScienceBoosters()}
            
            {/* Regular boosters - removed background */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Boosters</h3>
                <div className="text-xs px-2 py-0.5 bg-white/70 backdrop-blur-sm rounded-full">
                  Tap to use
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl">
                {currentRoomBoosters.map((booster) => (
                  booster.isPhaseRecipe ? (
                    <PhaseRecipeRoulette key={booster.id} phase={currentPhase} />
                  ) : (
                    <div 
                      key={booster.id}
                      onClick={() => handleBoosterClick(booster)}
                      className="flex flex-col items-center p-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={booster.icon} 
                        alt={booster.name}
                        className="w-10 h-10 object-contain mb-1 animate-pulse-slow"
                      />
                      <span className="text-xs font-medium text-center">{booster.name}</span>
                      {booster.cost && (
                        <div className="flex items-center gap-1 mt-1 text-2xs bg-yellow-100 px-1.5 py-0.5 rounded-full">
                          <CoinsIcon className="h-3 w-3 text-yellow-500" />
                          <span>{booster.cost}</span>
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modals - keep existing code */}
        <YogaPoseModal
          isOpen={showYogaPoses}
          onClose={() => setShowYogaPoses(false)}
          poses={yogaPoses}
          phase={currentPhase}
        />
        
        <ProductivityTipsModal
          isOpen={showProductivityTips}
          onClose={() => setShowProductivityTips(false)}
          phase={currentPhase}
        />
        
        <JournalingModal
          isOpen={showJournalingModal}
          onClose={() => setShowJournalingModal(false)}
          phase={currentPhase}
        />
        
        <BloodworkModal
          isOpen={showBloodworkModal}
          onClose={() => setShowBloodworkModal(false)}
          phase={currentPhase}
        />
        
        {showTutorial && (
          <UterooTutorial onClose={() => setShowTutorial(false)} />
        )}
        
        {currentRoom.id === 'cycle_sanctuary' && (
          <CycleSanctuary 
            currentPhase={currentPhase}
            onPhaseChange={handlePhaseChange}
          />
        )}
      </div>
    </div>
  );
};

export default PouGame;
