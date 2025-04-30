import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Apple, Bath, Bed, Gamepad, 
  ShoppingBag, Heart, Droplet, BatteryFull, 
  Home, Dumbbell, Brain, Moon, Sun, Leaf, UtensilsCrossed, Laptop, Beaker,
  Flame, HelpCircle, Calendar
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

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const enemies = {
  menstruation: [
    { id: "cramps", name: "Cramps", hp: 3, icon: "/lovable-uploads/52b8fe36-6c7e-4397-b705-b055fa4d0c62.png" },
    { id: "fatigue", name: "Fatigue", hp: 2, icon: "/lovable-uploads/d67a2349-3eb7-47bf-b2b7-e52514f533f2.png" }
  ],
  follicular: [
    { id: "anxiety", name: "Anxiety", hp: 2, icon: "/lovable-uploads/d53d93fd-3fa3-4ab3-aa9a-f36a2f184218.png" },
    { id: "migraine", name: "Migraine", hp: 3, icon: "/lovable-uploads/61451e82-27fc-4110-94e4-a08167b4d8db.png" }
  ],
  ovulatory: [
    { id: "sensitivity", name: "Sensitivity", hp: 2, icon: "/lovable-uploads/5456ad76-fc4d-41bf-af80-f17afa7e0ff8.png" },
    { id: "migraine", name: "Migraine", hp: 3, icon: "/lovable-uploads/4a7e6242-abfe-4345-9727-07fd2c60357a.png" }
  ],
  luteal: [
    { id: "irritability", name: "Irritability", hp: 3, icon: "/lovable-uploads/d400493e-b747-4572-9f72-d3e592cc4a3f.png" },
    { id: "sadness", name: "Sadness", hp: 3, icon: "/lovable-uploads/b63fbdb8-0dd0-463d-9269-7bce9726d517.png" }
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
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "bathroom", 
    name: "Bathroom", 
    icon: Bath,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "kitchen", 
    name: "Kitchen", 
    icon: UtensilsCrossed,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "exercise", 
    name: "Exercise Room", 
    icon: Dumbbell,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "games", 
    name: "Game Room", 
    icon: Gamepad,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "workstation", 
    name: "Work Station", 
    icon: Laptop,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "shop", 
    name: "Shop", 
    icon: ShoppingBag,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "lab", 
    name: "The Lab", 
    icon: Beaker,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
  },
  { 
    id: "cycle_sanctuary", 
    name: "Cycle Sanctuary", 
    icon: Calendar,
    background: "/lovable-uploads/d0cfdfa2-4df7-4fdb-9606-8ddcfd8dffe8.png"
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
    coins: 200
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

  const renderEnemies = () => {
    return currentEnemies.map((enemy) => (
      <div key={enemy.id} className="relative flex flex-col items-center">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="relative cursor-help">
                <img 
                  src={enemy.icon} 
                  alt={enemy.name}
                  className="w-20 h-20 object-contain pixelated"
                />
                <div className="absolute -top-2 -right-2">
                  <div className="bg-white/80 rounded-full p-0.5 shadow-sm">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="max-w-[250px] p-4 bg-white/95 backdrop-blur-sm text-left"
            >
              {getEnemyTooltip(enemy.id) ? (
                <>
                  <h4 className="font-semibold mb-1">{getEnemyTooltip(enemy.id)?.title}</h4>
                  <p className="text-sm">{getEnemyTooltip(enemy.id)?.description}</p>
                </>
              ) : (
                <p className="text-sm">Este síntoma está relacionado con los cambios hormonales de tu ciclo.</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm font-bold mt-2">{enemy.name}</span>
        {showDamage && (
          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-red-500 font-bold animate-bounce">
            -1 HP
          </span>
        )}
      </div>
    ));
  };

  // Add phase progress indicator
  const renderPhaseProgress = () => {
    // This is a simplified version - in a real implementation, you'd calculate actual days
    const currentDay = 2; // Assuming day 2 of the phase for demonstration
    const phaseDuration = 7; // Assuming 7 days per phase for demonstration
    const nextPhase = currentPhase === 'menstruation' ? 'follicular' : 
                     currentPhase === 'follicular' ? 'ovulatory' :
                     currentPhase === 'ovulatory' ? 'luteal' : 'menstruation';
    
    const nextPhaseInfo = phaseInfo[nextPhase];
    
    return (
      <div className="mb-4 px-4">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="font-medium">Día {currentDay}/{phaseDuration} de {phaseInfo[currentPhase].subtitle}</span>
          <span>Próximo: {nextPhaseInfo.subtitle}</span>
        </div>
        <Progress value={(currentDay/phaseDuration) * 100} className="h-1" />
      </div>
    );
  };

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
          <div className="max-w-md mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">{phase.name}</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/50 hover:bg-white/70"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-center mb-2">{phase.subtitle}</h2>
          {renderPhaseProgress()}
          <div className="flex justify-center gap-2 px-4 phase-buttons">
            {(Object.keys(phaseInfo) as Phase[]).map((phaseName) => {
              const PhaseIconComponent = phaseInfo[phaseName].icon;
              return (
                <Button
                  key={phaseName}
                  variant={currentPhase === phaseName ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePhaseChange(phaseName)}
                  className={cn(
                    "relative flex items-center gap-1.5",
                    currentPhase === phaseName && `bg-${phaseInfo[phaseName].color}-600`
                  )}
                >
                  <PhaseIconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{phaseInfo[phaseName].subtitle}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Stats display */}
        <div className="fixed top-24 left-0 p-4 bg-white/30 backdrop-blur-sm shadow-md rounded-r-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-red-500" />
              <Progress value={stats.hunger} className={cn("w-24 h-2", getProgressColor(stats.hunger))} />
              <span className="text-xs font-medium">{stats.hunger}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              <Progress value={stats.hygiene} className={cn("w-24 h-2", getProgressColor(stats.hygiene))} />
              <span className="text-xs font-medium">{stats.hygiene}%</span>
            </div>
            <div className="flex items-center gap-2">
              <BatteryFull className="h-5 w-5 text-green-500" />
              <Progress value={stats.energy} className={cn("w-24 h-2", getProgressColor(stats.energy))} />
              <span className="text-xs font-medium">{stats.energy}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <Progress value={stats.happiness} className={cn("w-24 h-2", getProgressColor(stats.happiness))} />
              <span className="text-xs font-medium">{stats.happiness}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-yellow-500" />
              <span className="text-xs font-medium">{stats.coins} coins</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-xs font-medium">Streak: {streak} days</span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 pt-40 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="sm" onClick={handlePreviousRoom}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              
              <div className="flex items-center gap-2">
                <RoomIcon className="h-5 w-5" />
                <h2 className="text-lg font-medium">{currentRoom.name}</h2>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleNextRoom}>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Character area with droppable zone */}
            <div 
              className="relative flex flex-col items-center justify-center min-h-[300px]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="mb-6 flex space-x-10 justify-center">
                {renderEnemies()}
              </div>
              
              <UterooCharacter phase={currentPhase} />
              
              {showBoostIndicator && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-green-500 animate-bounce">
                  +{boostType}!
                </div>
              )}
            </div>
            
            {/* Items/boosters for current room */}
            <div className="mt-8">
              <h3 className="text-center font-semibold mb-4">Available Items</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
                {currentRoomBoosters.map((booster) => (
                  <DraggableItem 
                    key={booster.id}
                    id={booster.id}
                    type={booster.type}
                    icon={booster.icon}
                    boost={booster.boost}
                    onDrop={() => {}} // This doesn't seem to be used, but kept for prop compatibility
                    onClick={() => handleBoosterClick(booster)}
                    meditationPlaylist={booster.meditationPlaylist}
                    journalingItem={booster.journalingItem}
                    tooltip={booster.tooltip}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Room navigation indicator */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/30 backdrop-blur-sm shadow-md">
          <div className="flex justify-center gap-2 max-w-md mx-auto overflow-x-auto pb-2">
            {rooms.map((room, index) => {
              const RoomIconComponent = room.icon;
              return (
                <Button
                  key={room.id}
                  variant={currentRoomIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentRoomIndex(index)}
                  className="min-w-[40px]"
                >
                  <RoomIconComponent className="h-4 w-4" />
                  <span className="sr-only">{room.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Modals - Fix prop passing to match component requirements */}
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
        
        <UterooTutorial
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
        
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
