import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, Apple, Bath, Bed, Gamepad, ShoppingBag, Heart, Droplet, BatteryFull, Home, Dumbbell, Brain, Moon, Sun, Leaf, UtensilsCrossed, Laptop, Beaker, Flame, HelpCircle, Calendar as CalendarIcon, CoinsIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CompanionNaming } from "./CompanionNaming";
import { AvatarCustomization } from "./AvatarCustomization";
import { HealthSlider } from "./HealthSlider";
import { PreMenstrualGame } from "./PreMenstrualGame";
import { PostMenstrualGame } from "./PostMenstrualGame";
import { useAuth } from "./AuthProvider";
import { useQuestionnaire, UserType, QuestionnaireResponse } from '@/hooks/useQuestionnaire';
import { useCustomAuth } from '@/hooks/useCustomAuth';
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
import { KitchenRoomInteraction } from "@/components/KitchenRoomInteraction";
import { ShopRoom } from "@/components/ShopRoom";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RecipeRoulette } from "@/components/RecipeRoulette";
import { PhaseRecipeRoulette } from "@/components/PhaseRecipeRoulette";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PhaseVideos } from "@/components/PhaseVideos";
import { AudioToggle } from "@/components/AudioToggle";
import { audioService } from "@/utils/audioService";
import { SurvivalPack } from "@/components/SurvivalPack";
import { SymptomSliderScreen } from "./SymptomSliderScreen";
import { symptomScreens, getAllSymptomIds } from "@/data/symptomDefinitions";

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: string[];
  emoji: string;
}

interface HealthQuestion {
  id: string;
  text: string;
  emoji: string;
  minLabel: string;
  maxLabel: string;
  minValue: number;
  maxValue: number;
}

// Define the FloatingHeart interface
interface FloatingHeart {
  id: string;
  x: number; // x position offset
  y: number; // y position offset
}

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

// Universal first question - updated to support date selection
const firstQuestion: Question = {
  id: 'period_status',
  text: 'When was your last period?',
  type: 'single',
  emoji: '🩸',
  options: [
    '📅 Select date',
    '🔴 I\'m on it right now!',
    '🌱 I haven\'t gotten my period yet',
    '🦋 I stopped getting my period',
    '🧡 I don\'t remember'
  ]
};

// Health questions (universal for all user types)
const healthQuestions: HealthQuestion[] = [
  {
    id: 'hydration',
    text: 'Glasses of water today',
    emoji: '💧',
    minLabel: '0-2',
    maxLabel: '8-10+',
    minValue: 0,
    maxValue: 10
  },
  {
    id: 'exercise',
    text: 'Minutes of activity today',
    emoji: '🏃‍♀️',
    minLabel: '0-10',
    maxLabel: '30-45+',
    minValue: 0,
    maxValue: 45
  },
  {
    id: 'nutrition',
    text: 'Plate "greenness" score',
    emoji: '🥗',
    minLabel: '1-3',
    maxLabel: '8-10',
    minValue: 1,
    maxValue: 10
  }
];

// Menstrual user questions (for "I'm on it right now", "Tap to select", "I don't remember")
const menstrualQuestions: Question[] = [
  {
    id: 'period_length',
    text: 'How long do your periods usually last?',
    type: 'single',
    emoji: '🩸',
    options: [
      '🩸 3-5 days',
      '🩸 6-7 days', 
      '🩸 8+ days',
      '♾️ It varies a lot'
    ]
  },
  {
    id: 'cycle_predictability',
    text: 'How predictable is your cycle?',
    type: 'single',
    emoji: '📅',
    options: [
      '⏰ Like clockwork!',
      '📊 Usually 25-35 days',
      '🥂 Complete surprise every month'
    ]
  },
  {
    id: 'ovulation_signs',
    text: 'Do you notice any signs around ovulation?',
    type: 'single',
    emoji: '🥚',
    options: [
      '🥚 Egg-white discharge',
      '⚡ Energy boost',
      '🚫 No signs'
    ]
  },
  {
    id: 'pms_feelings',
    text: 'How do you feel 5-7 days before your period?',
    type: 'single',
    emoji: '😌',
    options: [
      '⚠️ Irritable/sensitive',
      '🧡 Bloated/craving carbs',
      '🌈 Totally fine, no changes!'
    ]
  },
  {
    id: 'annoying_symptom',
    text: 'What\'s your most annoying symptom?',
    type: 'single',
    emoji: '😣',
    options: [
      '😣 Cramps',
      '🎭 Mood swings',
      '😴 Fatigue'
    ]
  }
];

// Pre-period user questions (for "I haven't gotten my period yet")
const prePeriodQuestions: Question[] = [
  {
    id: 'age_range',
    text: 'How old are you?',
    type: 'single',
    emoji: '🌟',
    options: [
      '🌟 10-12 years old',
      '🌸 13-15 years old',
      '🌺 16+ years old'
    ]
  },
  {
    id: 'app_expectations',
    text: 'What are your expectations towards the app?',
    type: 'multiple',
    emoji: '🎯',
    options: [
      '📚 Learn about my changing body',
      '🤝 Get support and guidance',
      '🎯 Prepare for my first period',
      '💪 Build healthy habits'
    ]
  },
  {
    id: 'puberty_concerns',
    text: 'What concerns you most about puberty?',
    type: 'multiple',
    emoji: '🤔',
    options: [
      '😰 When will my period start?',
      '🤔 Body changes I\'m experiencing',
      '😳 Talking to others about it',
      '🌙 Mood and emotional changes'
    ]
  }
];

// Post-menstrual user questions (for "I stopped getting my period") - removed menopause_symptoms
const postMenstrualQuestions: Question[] = [
  {
    id: 'managing_changes',
    text: 'How are you managing these changes?',
    type: 'multiple',
    emoji: '💪',
    options: [
      '👩‍⚕️ Working with healthcare providers',
      '🥗 Diet, exercise, and lifestyle adjustments',
      '🌿 Herbal remedies and supplements',
      '👥 Connecting with others in similar situations',
      '🔍 Still figuring out what works for me'
    ]
  },
  {
    id: 'learning_goals',
    text: 'What would you like to learn most about through Uteroo?',
    type: 'multiple',
    emoji: '🌿',
    options: [
      '🌿 Natural ways to manage symptoms',
      '💪 Staying healthy during this transition',
      '🧘‍♀️ Emotional wellness strategies',
      '🩺 Understanding hormonal changes'
    ]
  }
];

// Phase info and enemy data
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
        description: "Recetas adaptadas a tus necesidades nutricionales específicas según tu fase del ciclo menstrual."
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

// Full POU GAME Component - replacing the simplified MenstrualGame
const MenstrualGame = ({ onComplete }: { onComplete: () => void }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>("menstruation");
  
  const [stats, setStats] = useState({
    hunger: 75,
    hygiene: 90,
    energy: 60,
    happiness: 85,
    coins: 200,
    hearts: 0
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
  const [lastStreakUpdateTime, setLastStreakUpdateTime] = useState(0);
  const [showSurvivalPack, setShowSurvivalPack] = useState(false);

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
        title: `🎉 ${streak + 1}-Day Streak Milestone!`,
        description: `You earned ${bonus} bonus coins for your dedication!`,
        duration: 5000,
      });
    } else {
      setStats(prev => ({
        ...prev,
        coins: prev.coins + 10,
      }));
      
      toast({
        title: `Streak continued: ${streak + 1} days`,
        description: "Great job taking care of yourself! +10 coins",
        duration: 2000,
      });
    }
  }, [streak, lastStreakUpdateTime, toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData("itemType");
    const boost = Number(e.dataTransfer.getData("boost")) || 10;
    
    setStats(prev => {
      const newStats = { ...prev };
      switch (itemType) {
        case "hunger":
          newStats.hunger = Math.min(100, prev.hunger + boost);
          audioService.play('water');
          break;
        case "hygiene":
          newStats.hygiene = Math.max(0, prev.hygiene + boost);
          audioService.play('click');
          break;
        case "energy":
          newStats.energy = Math.max(0, prev.energy + boost);
          audioService.play('boost');
          break;
        case "happiness":
          newStats.happiness = Math.max(0, prev.happiness + boost);
          audioService.play('bonus');
          break;
      }
      return newStats;
    });

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

  const handlePhaseChange = (newPhase: Phase) => {
    if (newPhase !== currentPhase) {
      audioService.play('levelup');
      audioService.playPhaseSound(newPhase);
      setCurrentPhase(newPhase);
    }
  };

  const handleBoosterClick = (booster: any) => {
    if (booster.type === 'hygiene') {
      audioService.play('water'); 
    } else if (booster.type === 'energy') {
      audioService.play('boost');
    } else if (booster.type === 'happiness') {
      audioService.play('bonus');
    } else {
      audioService.play('click');
    }
    
    if (booster.journalingItem) {
      setShowJournalingModal(true);
      return;
    }
    
    if (booster.bloodworkAnalysis) {
      setShowBloodworkModal(true);
      updateStreak();
      return;
    }
    
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
        audioService.play('click');
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

  const renderPhaseProgress = () => {
    const currentDay = 2;
    const phaseDuration = 7;
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
          backgroundImage: "url('/lovable-uploads/94f873e9-ed1b-4e4f-818c-5141de6c30c8.png')",
          backgroundSize: 'cover',
        }}
      />
      
      <div className={cn(
        "fixed inset-0 opacity-25 transition-colors duration-500",
        currentPhase === "menstruation" ? "bg-pink-400" :
        currentPhase === "follicular" ? "bg-green-400" :
        currentPhase === "ovulatory" ? "bg-yellow-400" :
        "bg-orange-400"
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

        <div className="flex-1 pt-52 pb-6 px-4">
          <div className="max-w-md mx-auto">
            {renderStatsPanel()}
            
            <div 
              className="relative flex flex-col items-center justify-center mb-4 mx-auto"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {showHeartBonus && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-bold animate-bounce-slow z-20">
                  +5 Hearts Bonus! 💗
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
              
              <div className="mb-4">
                <SurvivalPack 
                  isOpen={showSurvivalPack}
                  onToggle={() => setShowSurvivalPack(!showSurvivalPack)}
                  currentPhase={currentPhase}
                  hasActiveEnemies={currentEnemies.length > 0}
                  hasDailyGoals={false}
                  enemies={currentEnemies}
                />
              </div>

              <UterooCharacter 
                phase={currentPhase} 
                currentRoom="bedroom"
                size="large" 
                minimal={false} 
                onClick={handleUterooClick}
                enemies={currentEnemies}
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

            {/* Room boosters for interaction */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {roomBoosters.bedroom.map((booster) => (
                <TooltipProvider key={booster.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center p-4 h-auto"
                        onClick={() => handleBoosterClick(booster)}
                      >
                        <img src={booster.icon} alt={booster.name} className="w-8 h-8 mb-2" />
                        <span className="text-xs text-center">{booster.name}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 p-3 max-w-xs">
                      <h4 className="font-semibold mb-1">{booster.tooltip?.title || booster.name}</h4>
                      <p className="text-sm text-gray-600">{booster.tooltip?.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>

        <YogaPoseModal
          isOpen={showYogaPoses}
          onClose={() => {
            audioService.play('click');
            setShowYogaPoses(false);
          }}
          poses={yogaPoses}
          phase={currentPhase}
        />
        
        <ProductivityTipsModal
          isOpen={showProductivityTips}
          onClose={() => {
            audioService.play('click');
            setShowProductivityTips(false);
          }}
          phase={currentPhase}
        />
        
        <JournalingModal
          isOpen={showJournalingModal}
          onClose={() => {
            audioService.play('click');
            setShowJournalingModal(false);
          }}
          phase={currentPhase}
        />
        
        <BloodworkModal
          isOpen={showBloodworkModal}
          onClose={() => {
            audioService.play('click');
            setShowBloodworkModal(false);
          }}
          phase={currentPhase}
        />
        
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

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { logout } = useCustomAuth();
  const { addResponse, saveQuestionnaire } = useQuestionnaire();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({});
  const [showHealthQuestions, setShowHealthQuestions] = useState(false);
  const [showTypeQuestions, setShowTypeQuestions] = useState(false);
  const [showPreMenstrualGame, setShowPreMenstrualGame] = useState(false);
  const [showPostMenstrualGame, setShowPostMenstrualGame] = useState(false);
  const [showMenstrualGame, setShowMenstrualGame] = useState(false);
  const [typeQuestionIndex, setTypeQuestionIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSymptomSliders, setShowSymptomSliders] = useState(false);
  const [currentSymptomScreen, setCurrentSymptomScreen] = useState(0);

  const classifyUserType = (answer: string): UserType => {
    if (answer.includes('I\'m on it right now') || 
        answer.includes('Select date') || 
        answer.includes('I don\'t remember') ||
        answer.startsWith('Period started on')) {
      return 'MENSTRUAL';
    } else if (answer.includes('I haven\'t gotten my period yet')) {
      return 'PRE_PERIOD';
    } else {
      return 'POST_MENSTRUAL';
    }
  };

  const getCurrentQuestion = (): Question | null => {
    if (currentStep === 0) {
      return firstQuestion;
    }
    if (showTypeQuestions && currentQuestions.length > 0) {
      return currentQuestions[typeQuestionIndex];
    }
    return null;
  };

  const getTotalSteps = (): number => {
    if (currentStep === 0) return 1;
    return 1 + 1 + currentQuestions.length; // First question + combined health questions + type questions
  };

  const getCurrentStepNumber = (): number => {
    if (currentStep === 0) return 1;
    if (showHealthQuestions) return 2; // Health questions are now step 2
    if (showTypeQuestions) return 2 + typeQuestionIndex + 1; // Type questions start from step 3
    return 1;
  };

  // Add the missing symptom slider handler functions
  const handleSymptomChange = (symptomId: string, value: number) => {
    setResponses(prev => ({ ...prev, [symptomId]: value }));
    
    // Add to questionnaire responses
    const response: QuestionnaireResponse = {
      questionId: symptomId,
      questionText: `Symptom intensity: ${symptomId}`,
      answerValue: value.toString(),
      answerType: 'single'
    };
    
    addResponse(response);
  };

  const handleSymptomNext = () => {
    if (currentSymptomScreen < symptomScreens.length - 1) {
      setCurrentSymptomScreen(prev => prev + 1);
    } else {
      // Completed all symptom screens, continue with post-menstrual questions
      setShowSymptomSliders(false);
      setShowTypeQuestions(true);
    }
  };

  const handleSymptomBack = () => {
    if (currentSymptomScreen > 0) {
      setCurrentSymptomScreen(prev => prev - 1);
    } else {
      // Go back to health questions
      setShowSymptomSliders(false);
      setShowHealthQuestions(true);
    }
  };

  const canProceedFromSymptoms = (): boolean => {
    const currentSymptoms = symptomScreens[currentSymptomScreen];
    return currentSymptoms.every(symptom => 
      responses[symptom.id] !== undefined && responses[symptom.id] !== null
    );
  };

  const handleAnswer = (answer: string | string[]) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    const answerValue = Array.isArray(answer) ? answer.join(', ') : answer;
    
    setResponses(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    const response: QuestionnaireResponse = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answerValue,
      answerType: currentQuestion.type
    };
    
    addResponse(response);

    if (currentStep === 0) {
      const type = classifyUserType(answerValue);
      setUserType(type);
      
      let typeQuestions: Question[] = [];
      switch (type) {
        case 'MENSTRUAL':
          typeQuestions = menstrualQuestions;
          break;
        case 'PRE_PERIOD':
          typeQuestions = prePeriodQuestions;
          break;
        case 'POST_MENSTRUAL':
          typeQuestions = postMenstrualQuestions;
          // Immediately start symptom sliders for post-menstrual users
          setCurrentQuestions(typeQuestions);
          setCurrentStep(1);
          setShowHealthQuestions(true);
          return;
      }
      
      setCurrentQuestions(typeQuestions);
      setCurrentStep(1);
      setShowHealthQuestions(true);
    } else if (showTypeQuestions) {
      if (userType === 'MENSTRUAL' && currentQuestion.id === 'annoying_symptom') {
        setShowTypeQuestions(false);
        setShowMenstrualGame(true);
        return;
      }

      if (typeQuestionIndex < currentQuestions.length - 1) {
        setTypeQuestionIndex(prev => prev + 1);
      } else {
        if (userType === 'PRE_PERIOD') {
          setShowTypeQuestions(false);
          setShowPreMenstrualGame(true);
        } else if (userType === 'POST_MENSTRUAL') {
          setShowTypeQuestions(false);
          setShowPostMenstrualGame(true);
        } else {
          handleOnboardingComplete();
        }
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowDatePicker(false);
      const formattedDate = format(date, 'PPP');
      handleAnswer(`Period started on ${formattedDate}`);
    }
  };

  const handleHealthAnswer = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    const healthQuestion = healthQuestions.find(q => q.id === questionId);
    if (healthQuestion) {
      const response: QuestionnaireResponse = {
        questionId: healthQuestion.id,
        questionText: healthQuestion.text,
        answerValue: value.toString(),
        answerType: 'single'
      };
      
      addResponse(response);
    }
  };

  const handleHealthContinue = () => {
    // Check if all health questions have been answered
    const allHealthAnswered = healthQuestions.every(q => 
      responses[q.id] !== undefined && responses[q.id] !== null
    );
    
    if (!allHealthAnswered) {
      // Optionally show a toast or message that all sliders need to be set
      return;
    }
    
    setShowHealthQuestions(false);
    
    // For post-menstrual users, go directly to symptom sliders
    if (userType === 'POST_MENSTRUAL') {
      setShowSymptomSliders(true);
      setCurrentSymptomScreen(0);
    } else {
      setShowTypeQuestions(true);
    }
  };

  const handleMenstrualGameComplete = () => {
    setShowMenstrualGame(false);
    handleOnboardingComplete();
  };

  const handlePreMenstrualGameComplete = () => {
    setShowPreMenstrualGame(false);
    handleOnboardingComplete();
  };

  const handlePostMenstrualGameComplete = () => {
    setShowPostMenstrualGame(false);
    handleOnboardingComplete();
  };

  const handleOnboardingComplete = async () => {
    if (!user || !userType) return;
    
    const success = await saveQuestionnaire(user.id, userType);
    if (success) {
      onComplete();
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Show Symptom Sliders for POST_MENSTRUAL users
  if (showSymptomSliders) {
    // Filter responses to only include symptom IDs with numeric values
    const symptomResponses = getAllSymptomIds().reduce((acc, symptomId) => {
      const response = responses[symptomId];
      if (typeof response === 'number') {
        acc[symptomId] = response;
      }
      return acc;
    }, {} as Record<string, number>);

    return (
      <SymptomSliderScreen
        currentScreen={currentSymptomScreen}
        totalScreens={symptomScreens.length}
        symptoms={symptomScreens[currentSymptomScreen]}
        responses={symptomResponses}
        onSymptomChange={handleSymptomChange}
        onNext={handleSymptomNext}
        onBack={handleSymptomBack}
        canProceed={canProceedFromSymptoms()}
      />
    );
  }

  // Show Post-Menstrual Game for POST_MENSTRUAL users
  if (showPostMenstrualGame) {
    const symptomResponses = getAllSymptomIds().reduce((acc, symptomId) => {
      if (responses[symptomId] !== undefined) {
        acc[symptomId] = responses[symptomId] as number;
      }
      return acc;
    }, {} as Record<string, number>);

    return <PostMenstrualGame onComplete={handlePostMenstrualGameComplete} symptomResponses={symptomResponses} />;
  }

  // Show Pre-Menstrual Game for PRE_PERIOD users
  if (showPreMenstrualGame) {
    return <PreMenstrualGame onComplete={handlePreMenstrualGameComplete} />;
  }

  // Show Menstrual Game for MENSTRUAL users
  if (showMenstrualGame) {
    return <MenstrualGame onComplete={handleMenstrualGameComplete} />;
  }

  if (showHealthQuestions) {
    const totalSteps = getTotalSteps();
    const currentStepNum = getCurrentStepNumber();
    const progress = (currentStepNum / totalSteps) * 100;

    // Check if all health questions have been answered for continue button
    const allHealthAnswered = healthQuestions.every(q => 
      responses[q.id] !== undefined && responses[q.id] !== null
    );

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  Step {currentStepNum} of {totalSteps}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold">
              Daily Health Check-In
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Set your current levels for today
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              {healthQuestions.map((healthQuestion) => (
                <div key={healthQuestion.id} className="flex justify-center">
                  <HealthSlider
                    questionText={healthQuestion.text}
                    emoji={healthQuestion.emoji}
                    minLabel={healthQuestion.minLabel}
                    maxLabel={healthQuestion.maxLabel}
                    minValue={healthQuestion.minValue}
                    maxValue={healthQuestion.maxValue}
                    value={responses[healthQuestion.id] as number || healthQuestion.minValue}
                    onChange={(value) => handleHealthAnswer(healthQuestion.id, value)}
                  />
                </div>
              ))}
            </div>
            
            <Button
              onClick={handleHealthContinue}
              disabled={!allHealthAnswered}
              className="w-full mt-6 rounded-full"
            >
              Continue {!allHealthAnswered && "(Please set all sliders)"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showTypeQuestions) {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    const totalSteps = getTotalSteps();
    const currentStepNum = getCurrentStepNumber();
    const progress = (currentStepNum / totalSteps) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  Question {currentStepNum} of {totalSteps}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
              <span className="text-3xl">{currentQuestion.emoji}</span>
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {currentQuestion.type === 'single' && (
              <div className="grid gap-3">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiple' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select all that apply:</p>
                <div className="grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const currentResponses = responses[currentQuestion.id] as string[] || [];
                    const isSelected = currentResponses.includes(option);
                    
                    return (
                      <Button
                        key={option}
                        variant={isSelected ? "default" : "outline"}
                        className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
                        onClick={() => {
                          const current = responses[currentQuestion.id] as string[] || [];
                          const updated = isSelected
                            ? current.filter(item => item !== option)
                            : [...current, option];
                          setResponses(prev => ({ ...prev, [currentQuestion.id]: updated }));
                        }}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  onClick={() => handleAnswer(responses[currentQuestion.id] as string[] || [])}
                  disabled={!responses[currentQuestion.id] || (responses[currentQuestion.id] as string[]).length === 0}
                  className="w-full mt-4 rounded-full"
                >
                  Continue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) return null;

  const totalSteps = getTotalSteps();
  const progress = (1 / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Question 1 of {totalSteps}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
            <span className="text-3xl">{currentQuestion.emoji}</span>
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {currentQuestion.options.map((option) => {
              if (option === '📅 Select date') {
                return (
                  <Popover key={option} open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
                      >
                        {selectedDate ? format(selectedDate, 'PPP') : option}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="pointer-events-auto bg-white rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                );
              }
              
              return (
                <Button
                  key={option}
                  variant="outline"
                  className="p-4 text-left justify-start h-auto whitespace-normal rounded-full"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
