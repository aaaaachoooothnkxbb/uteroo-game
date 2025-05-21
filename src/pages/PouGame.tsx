import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { AudioToggle } from "@/components/AudioToggle";
import { audioService } from "@/utils/audioService";

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

// Updated rooms array with new shop room background
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

// Define shop categories
const shopCategories = [
  {
    id: "hormone_helpers",
    name: "Hormone Helpers",
    emoji: "🌿",
    color: "bg-[#F2FCE2]", // Sage Green
    textColor: "text-green-800",
    borderColor: "border-green-300",
    description: "Natural supplements for your cycle"
  },
  {
    id: "period_underwear",
    name: "Period Underwear",
    emoji: "🩲",
    color: "bg-[#FFDEE2]", // Dusty Pink
    textColor: "text-pink-800",
    borderColor: "border-pink-300",
    description: "Comfortable & sustainable protection"
  },
  {
    id: "cycle_selfcare",
    name: "Cycle Self-Care",
    emoji: "💆‍♀️",
    color: "bg-[#E5DEFF]", // Lavender
    textColor: "text-purple-800",
    borderColor: "border-purple-300",
    description: "Phase-specific wellness rituals"
  },
  {
    id: "sleep_stress",
    name: "Sleep & Stress",
    emoji: "🛏️",
    color: "bg-[#D3E4FD]", // Soft Blue
    textColor: "text-blue-800",
    borderColor: "border-blue-300",
    description: "Rest & relaxation essentials"
  },
  {
    id: "eco_essentials",
    name: "Eco Essentials",
    emoji: "💧",
    color: "bg-[#F2FCE2]", // Seafoam
    textColor: "text-emerald-800",
    borderColor: "border-emerald-300",
    description: "Sustainable period products"
  }
];

// Shop items by category
const shopItems = {
  hormone_helpers: [
    {
      id: "flo_vitamins",
      name: "FLO PMS Gummy Vitamins",
      brand: "FLO",
      price: 29.99,
      description: "Cycle-synced gummies for PMS relief with Chasteberry & Vitamin B6",
      bestForPhase: "luteal",
      image: "/lovable-uploads/c5a3a3fe-1f7c-43fd-af31-47b307feb425.png",
      rating: 4.8,
      reviews: 487,
      boost: 30,
      type: "energy" as const,
      communityProof: "92% of users reported reduced bloating"
    },
    {
      id: "rae_mood",
      name: "Hormone Balance Capsules",
      brand: "Rae Wellness",
      price: 19.99,
      description: "Adaptogenic blend to support hormone regulation & mood balance",
      bestForPhase: "all",
      image: "/lovable-uploads/79e01f75-20fb-4814-a2d3-219a420a385b.png",
      rating: 4.5,
      reviews: 312,
      boost: 25,
      type: "happiness" as const,
      communityProof: "78% felt more emotionally stable within 30 days"
    }
  ],
  period_underwear: [
    {
      id: "thinx_briefs",
      name: "Super Absorbent Period Underwear",
      brand: "Thinx",
      price: 34.99,
      description: "Holds up to 5 tampons worth & keeps you dry all day",
      bestForPhase: "menstruation",
      image: "/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png",
      rating: 4.9,
      reviews: 1243,
      boost: 35,
      type: "hygiene" as const,
      communityProof: "95% of users switched from disposable products"
    },
    {
      id: "ruby_love_sleep",
      name: "Overnight Sleep Shorts",
      brand: "Ruby Love",
      price: 39.99,
      description: "Leakproof protection for heavy flow nights with built-in absorbent gusset",
      bestForPhase: "menstruation",
      image: "/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png",
      rating: 4.7,
      reviews: 892,
      boost: 30,
      type: "hygiene" as const,
      communityProof: "9 out of 10 users report better sleep during periods"
    }
  ],
  cycle_selfcare: [
    {
      id: "delune_tincture",
      name: "Cramp Relief Tincture",
      brand: "De Lune",
      price: 32.00,
      description: "Anti-inflammatory herbal blend with ginger & cramp bark",
      bestForPhase: "menstruation",
      image: "/lovable-uploads/861f1be0-201e-4269-be4e-3b74dbb8e136.png",
      rating: 4.6,
      reviews: 758,
      boost: 35,
      type: "energy" as const,
      communityProof: "85% reported decreased pain within 30 minutes"
    },
    {
      id: "moon_juice_dusts",
      name: "Power Dust Adaptogen Blend",
      brand: "Moon Juice",
      price: 42.00,
      description: "Energy-boosting adaptogenic herbs for follicular phase power",
      bestForPhase: "follicular",
      image: "/lovable-uploads/c00b6791-8007-435f-a0fd-63104a0d898b.png",
      rating: 4.4,
      reviews: 632,
      boost: 25,
      type: "energy" as const,
      communityProof: "3x energy lift reported by users in follicular phase"
    }
  ],
  sleep_stress: [
    {
      id: "opositiv_calm",
      name: "Magnesium Sleep Blend",
      brand: "Opositiv",
      price: 27.99,
      description: "Stress-reducing magnesium & L-theanine blend for deep sleep",
      bestForPhase: "luteal",
      image: "/lovable-uploads/3f7be505-d8c4-43e8-b44e-92332022c3f1.png",
      rating: 4.7,
      reviews: 891,
      boost: 30,
      type: "happiness" as const,
      communityProof: "89% of users report falling asleep faster"
    },
    {
      id: "ritual_stress",
      name: "Luteal Phase Calm Capsules",
      brand: "Ritual",
      price: 35.00,
      description: "Ashwagandha & B vitamin blend to reduce premenstrual anxiety",
      bestForPhase: "luteal",
      image: "/lovable-uploads/db737ae2-ab52-4d61-af92-95a81616243d.png",
      rating: 4.6,
      reviews: 745,
      boost: 25,
      type: "happiness" as const,
      communityProof: "77% felt less irritable during PMS week"
    }
  ],
  eco_essentials: [
    {
      id: "saalt_cup",
      name: "Reusable Menstrual Cup",
      brand: "Saalt",
      price: 29.00,
      description: "Medical-grade silicone cup with 12-hour protection",
      bestForPhase: "menstruation",
      image: "/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png",
      rating: 4.8,
      reviews: 2154,
      boost: 40,
      type: "hygiene" as const,
      communityProof: "Over 98% would never go back to disposables"
    },
    {
      id: "daye_cbd_tampons",
      name: "CBD-Infused Organic Tampons",
      brand: "Daye",
      price: 24.00,
      description: "Lab-tested organic cotton with pain-relieving CBD core",
      bestForPhase: "menstruation",
      image: "/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png",
      rating: 4.9,
      reviews: 876,
      boost: 30,
      type: "hygiene" as const,
      communityProof: "86% experienced reduced cramp intensity"
    }
  ]
};

// Quiz questions for product matching
const quizQuestions = [
  {
    id: "symptom",
    question: "What's your most bothersome symptom?",
    options: [
      { id: "cramps", label: "Cramps & pain" },
      { id: "mood", label: "Mood swings" },
      { id: "fatigue", label: "Low energy/fatigue" },
      { id: "sleep", label: "Sleep issues" },
      { id: "bloating", label: "Bloating" }
    ]
  },
  {
    id: "phase",
    question: "Which phase do you struggle with most?",
    options: [
      { id: "menstruation", label: "Menstruation" },
      { id: "follicular", label: "Follicular" },
      { id: "ovulatory", label: "Ovulatory" },
      { id: "luteal", label: "Luteal (PMS)" }
    ]
  },
  {
    id: "priority",
    question: "What's most important to you?",
    options: [
      { id: "natural", label: "All-natural ingredients" },
      { id: "eco", label: "Eco-friendly" },
      { id: "science", label: "Science-backed" },
      { id: "fast", label: "Fast-acting" }
    ]
  }
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
  // The shop room boosters have been removed as we're replacing the entire shop experience
  shop: [],
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
  const location = useLocation();
  const { toast } = useToast();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  
  // Get the initial phase from the location state or default to menstruation
  const [currentPhase, setCurrentPhase] = useState<Phase>(() => {
    const initialPhase = location.state?.initialPhase as Phase;
    return initialPhase || "menstruation";
  });
  
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
  
  // New shop-related state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [quickAddAnimation, setQuickAddAnimation] = useState<string | null>(null);
  const [showFindMyMatchQuiz, setShowFindMyMatchQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<any | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showShopEmptyState, setShowShopEmptyState] = useState(true);
  
  // Log the initial phase when component mounts
  useEffect(() => {
    console.log("Initial phase from navigation:", location.state?.initialPhase);
    
    // Show a toast to indicate which phase we're starting with
    if (location.state?.initialPhase) {
      const phaseData = phaseInfo[location.state.initialPhase as Phase];
      toast({
        title: `Starting in ${phaseData.subtitle} phase`,
        description: `${phaseData.emoji} ${phaseData.description}`,
        duration: 3000,
      });

      // Play phase sound when starting
      audioService.playPhaseSound(location.state.initialPhase);
    }
  }, [location.state, toast]);

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

  // Implement the updateStreak function to handle streak updates
  const updateStreak = useCallback(() => {
    const now = Date.now();
    
    // Only update streak once every 20 seconds to prevent abuse
    if (now - lastStreakUpdateTime < 20000) {
      return;
    }
    
    setLastStreakUpdateTime(now);
    setStreak(prevStreak => prevStreak + 1);
    
    // Give bonus coins for streak milestones
    if ((streak + 1) % 10 === 0) {
      const bonus = Math.floor((streak + 1) / 10) * 50; // 50 coins per 10 days
      setStats(prev => ({
        ...prev,
        coins: prev.coins + bonus,
      }));
      
      // Play celebration sound
      audioService.play('bonus');
      
      // Show achievement toast
      toast({
        title: `🎉 ${streak + 1}-Day Streak Milestone!`,
        description: `You earned ${bonus} bonus coins for your dedication!`,
        duration: 5000,
      });
    } else {
      // Regular streak update
      setStats(prev => ({
        ...prev,
        coins: prev.coins + 10, // 10 coins per regular streak update
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
          audioService.play('water'); // Food/hydration sound
          break;
        case "hygiene":
          newStats.hygiene = Math.max(0, prev.hygiene + boost);
          audioService.play('click'); // Clean sound
          break;
        case "energy":
          newStats.energy = Math.max(0, prev.energy + boost);
          audioService.play('boost'); // Energizing sound
          break;
        case "happiness":
          newStats.happiness = Math.max(0, prev.happiness + boost);
          audioService.play('bonus'); // Happy sound
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
    audioService.play('click');
    setCurrentRoomIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
    // Reset shop state when navigating away from shop
    if (rooms[currentRoomIndex].id === 'shop') {
      setSelectedCategory(null);
      setFlippedCards([]);
      setShowShopEmptyState(true);
    }
  };

  const handlePreviousRoom = () => {
    audioService.play('click');
    setCurrentRoomIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
    // Reset shop state when navigating away from shop
    if (rooms[currentRoomIndex].id === 'shop') {
      setSelectedCategory(null);
      setFlippedCards([]);
      setShowShopEmptyState(true);
    }
  };

  const handlePhaseChange = (newPhase: Phase) => {
    // Only play sound if actually changing phases
    if (newPhase !== currentPhase) {
      audioService.play('levelup');
      audioService.playPhaseSound(newPhase);
      setCurrentPhase(newPhase);
    }
  };

  const currentRoom = rooms[currentRoomIndex];
  const RoomIcon = currentRoom.icon;
  const currentRoomBoosters = roomBoosters[currentRoom.id as keyof typeof roomBoosters] || [];

  // Handle card flip animation in shop
  const handleCardFlip = (itemId: string) => {
    audioService.play('click');
    setFlippedCards(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle quick add animation and purchase
  const handleQuickAdd = (item: any) => {
    // Check if user has enough coins
    if (stats.coins < item.price) {
      audioService.play('click'); // Error sound
      toast({
        title: "Not enough coins!",
        description: `You need ${item.price} coins to purchase ${item.name}`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Purchase success
    audioService.play('bonus'); // "cha-ching" sound
    setStats(prev => ({
      ...prev,
      coins: prev.coins - item.price,
      [item.type]: Math.min(100, prev[item.type as keyof typeof prev] + item.boost)
    }));

    // Show animation
    setQuickAddAnimation(item.id);
    setTimeout(() => setQuickAddAnimation(null), 1000);

    // Show success toast
    toast({
      title: `Purchased ${item.name}!`,
      description: `+${item.boost} ${item.type} points! Supporting female founders 💪`,
      duration: 3000,
    });

    // Update streak
    updateStreak();

    // Check for rewards
    if (stats.coins >= 50) {
      toast({
        title: "Achievement Unlocked!",
        description: "You've earned the 'Wellness Explorer' badge for supporting hormone wellness!",
        duration: 5000,
      });
    }
  };

  // Handle category selection in shop
  const handleCategorySelect = (categoryId: string) => {
    audioService.play('click');
    setSelectedCategory(categoryId);
    setShowShopEmptyState(false);
    
    // When a category is selected, show a helpful toast
    const category = shopCategories.find(cat => cat.id === categoryId);
    if (category) {
      toast({
        title: `${category.emoji} ${category.name}`,
        description: category.description,
        duration: 3000,
      });
    }
  };

  // Handle quiz selection and results
  const handleQuizAnswer = (questionId: string, answerId: string) => {
    audioService.play('click');
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    
    // Move to next question or show results
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate quiz results based on answers
      const recommendations = getQuizRecommendations(quizAnswers);
      setQuizResults(recommendations);
      
      // Play success sound
      audioService.play('bonus');
      
      toast({
        title: "Your personalized recommendations!",
        description: "Based on your answers, we've found your perfect hormone helpers!",
        duration: 4000,
      });
    }
  };

  // Function to get quiz recommendations
  const getQuizRecommendations = (answers: Record<string, string>) => {
    // Simplified matching algorithm - would be more sophisticated in real app
    const symptom = answers.symptom;
    const phase = answers.phase;
    const priority = answers.priority;
    
    let bestMatches: any[] = [];
    
    // Combine all products
    let allProducts = [
      ...shopItems.hormone_helpers,
      ...shopItems.period_underwear,
      ...shopItems.cycle_selfcare,
      ...shopItems.sleep_stress,
      ...shopItems.eco_essentials
    ];
    
    // Filter by symptom
    if (symptom === 'cramps') {
      bestMatches = allProducts.filter(p => 
        p.description.toLowerCase().includes('cramp') || 
        p.description.toLowerCase().includes('pain')
      );
    } else if (symptom === 'mood') {
      bestMatches = allProducts.filter(p => 
        p.description.toLowerCase().includes('mood') || 
        p.description.toLowerCase().includes('anxiety')
      );
    } else if (symptom === 'fatigue') {
      bestMatches = allProducts.filter(p => 
        p.description.toLowerCase().includes('energy') || 
        p.description.toLowerCase().includes('fatigue')
      );
    } else if (symptom === 'sleep') {
      bestMatches = allProducts.filter(p => 
        p.description.toLowerCase().includes('sleep')
      );
    } else if (symptom === 'bloating') {
      bestMatches = allProducts.filter(p => 
        p.description.toLowerCase().includes('bloat')
      );
    }
    
    // If no matches by symptom, match by phase
    if (bestMatches.length === 0) {
      bestMatches = allProducts.filter(p => p.bestForPhase === phase);
    }
    
    // If still no matches, return top rated items
    if (bestMatches.length === 0) {
      bestMatches = allProducts.sort((a, b) => b.rating - a.rating).slice(0, 2);
    }
    
    // Sort by match percentage (simplified calculation)
    return bestMatches.map(product => {
      // Calculate match percentage based on how well it matches criteria
      let matchPercentage = 70; // Base percentage
      
      if (product.bestForPhase === phase) matchPercentage += 15;
      if (product.description.toLowerCase().includes(symptom)) matchPercentage += 10;
      if (priority === 'eco' && product.description.toLowerCase().includes('organic')) matchPercentage += 5;
      if (priority === 'natural' && product.description.toLowerCase().includes('natural')) matchPercentage += 5;
      if (priority === 'science' && product.description.toLowerCase().includes('lab')) matchPercentage += 5;
      
      return {
        ...product,
        matchPercentage: Math.min(98, matchPercentage) // Cap at 98%
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResults(null);
    setShowFindMyMatchQuiz(false);
  };

  const handleBoosterClick = (booster: any) => {
    // Play sound effect based on booster type
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
        audioService.play('click'); // Error sound
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
              "relative p-3 backdrop-blur-md shadow-sm border-l-4 rounded-lg snap-center flex-shrink-0",
              "min-w-[140px] max-w-[160px]",
              enemy.id === "cramps" || enemy.id === "fatigue" ? "border-l-red-500" :
              enemy.id === "anxiety" || enemy.id === "migraine" ? "border-l-yellow-500" :
              "border-l-orange-500"
            )}
            style={{ background: "transparent" }}
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

  // Function to render the shop room interface
  const renderShopRoom = () => {
    if (currentRoom.id !== 'shop') return null;
    
    return (
      <div className="mb-4">
        {/* Shop Room Title */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Hormone Wellness Shop</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
              <CoinsIcon className="h-3 w-3" />
              <span>{stats.coins} available</span>
            </div>
            {!showFindMyMatchQuiz && (
              <Button 
                variant="ghost" 
                className="h-7 text-xs px-2"
                onClick={() => {
                  audioService.play('click');
                  setShowFindMyMatchQuiz(true);
                  setShowShopEmptyState(false);
                }}
              >
                Find My Match
              </Button>
            )}
          </div>
        </div>
        
        {/* Shop Empty State */}
        {showShopEmptyState && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-3xl mb-4">🌸</div>
            <h3 className="text-lg font-medium mb-2">Your hormonal toolkit awaits!</h3>
            <p className="text-sm text-gray-500 mb-4">Tap a category to start exploring female-founded wellness brands</p>
            
            {/* Category Icons */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
              {shopCategories.map(category => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`${category.color} ${category.textColor} border ${category.borderColor} p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 animate-pulse-slow`}
                >
                  <div className="text-2xl mb-1">{category.emoji}</div>
                  <span className="text-xs font-medium text-center">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Category Products View */}
        {selectedCategory && !showFindMyMatchQuiz && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  audioService.play('click');
                  setSelectedCategory(null);
                  setShowShopEmptyState(true);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center">
                {(() => {
                  const category = shopCategories.find(cat => cat.id === selectedCategory);
                  return (
                    <>
                      <span className="text-xl mr-1">{category?.emoji}</span>
                      <span className="font-medium">{category?.name}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {shopItems[selectedCategory as keyof typeof shopItems]?.map(item => (
                <div 
                  key={item.id}
                  className={cn(
                    "relative overflow-hidden rounded-xl transition-transform duration-500",
                    flippedCards.includes(item.id) ? "rotate-y-180" : "rotate-y-0"
                  )}
                >
                  {/* Front of card */}
                  <div 
                    className={cn(
                      "bg-white/90 backdrop-blur-sm p-4 rounded-xl",
                      flippedCards.includes(item.id) ? "hidden" : "block"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <div className="text-xs text-gray-500">{item.brand}</div>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <div className="font-bold text-sm">${item.price}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs">★</span>
                              <span className="text-xs font-medium">{item.rating}</span>
                              <span className="text-xs text-gray-500">({item.reviews})</span>
                            </div>
                          </div>
                        </div>
                        
                        {item.bestForPhase !== 'all' && (
                          <div className="mt-1">
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              item.bestForPhase === 'menstruation' ? "bg-pink-100 text-pink-800" :
                              item.bestForPhase === 'follicular' ? "bg-green-100 text-green-800" :
                              item.bestForPhase === 'ovulatory' ? "bg-yellow-100 text-yellow-800" :
                              "bg-orange-100 text-orange-800"
                            )}>
                              Best for {item.bestForPhase}
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-2 flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleCardFlip(item.id)}
                          >
                            More info
                          </Button>
                          
                          <Button 
                            size="sm"
                            className="h-7"
                            onClick={() => handleQuickAdd(item)}
                          >
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            <span className="text-xs">
                              {quickAddAnimation === item.id ? "Added!" : "Quick Add"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div 
                    className={cn(
                      "bg-white/90 backdrop-blur-sm p-4 rounded-xl",
                      flippedCards.includes(item.id) ? "block rotate-y-180" : "hidden"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex justify-between items-center w-full">
                        <h4 className="font-medium">{item.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleCardFlip(item.id)}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-sm mt-2">{item.description}</div>
                      
                      <div className="mt-3 bg-purple-50 p-3 rounded-lg w-full">
                        <div className="text-xs text-purple-800 font-medium">Community Proof</div>
                        <div className="text-sm mt-1">"{item.communityProof}"</div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full mt-4">
                        <div className="flex items-center gap-1">
                          <span>+{item.boost}</span>
                          {item.type === 'energy' && <BatteryFull className="h-4 w-4 text-green-500" />}
                          {item.type === 'happiness' && <Heart className="h-4 w-4 text-pink-500" />}
                          {item.type === 'hygiene' && <Droplet className="h-4 w-4 text-blue-500" />}
                        </div>
                        
                        <Button onClick={() => handleQuickAdd(item)}>
                          ${item.price} • Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Find My Match Quiz */}
        {showFindMyMatchQuiz && !quizResults && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  audioService.play('click');
                  setShowFindMyMatchQuiz(false);
                  setShowShopEmptyState(true);
                  setQuizStep(0);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div>
                <h3 className="font-medium">Find My Hormone Match</h3>
                <p className="text-xs text-gray-500">Question {quizStep + 1} of {quizQuestions.length}</p>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl mb-4">
              <h4 className="font-medium mb-3">{quizQuestions[quizStep].question}</h4>
              
              <div className="space-y-2">
                {quizQuestions[quizStep].options.map(option => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-auto py-3 px-4",
                      quizAnswers[quizQuestions[quizStep].id] === option.id && "border-2 border-purple-500"
                    )}
                    onClick={() => handleQuizAnswer(quizQuestions[quizStep].id, option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Quiz Results */}
        {showFindMyMatchQuiz && quizResults && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => handleResetQuiz()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div>
                <h3 className="font-medium">Your Personalized Matches</h3>
                <p className="text-xs text-gray-500">Based on your unique needs</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {quizResults.slice(0, 2).map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-xl relative overflow-hidden"
                >
                  {/* Match percentage badge */}
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-2 py-1 rounded-bl-lg text-sm font-bold">
                    {item.matchPercentage}% Match
                  </div>
                  
                  <div className="flex items-start gap-3 pt-2">
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="text-xs text-gray-500">{item.brand}</div>
                      
                      <div className="mt-1 text-xs text-gray-700">{item.description}</div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="font-bold text-sm">${item.price}</div>
                        
                        <Button 
                          size="sm"
                          className="h-7"
                          onClick={() => handleQuickAdd(item)}
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          <span className="text-xs">Add to Toolkit</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => handleResetQuiz()}
                variant="outline"
                className="w-full"
              >
                Take Quiz Again
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
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
      
      {currentRoom.id === 'cycle_sanctuary' && (
        <CycleSanctuary 
          currentPhase={currentPhase}
          onPhaseChange={handlePhaseChange}
        />
      )}
    </div>
    
    {/* Add custom keyframe animations for shop interactions */}
    <style>
      {`
      @keyframes rotate-y-180 {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(180deg); }
      }
      
      @keyframes rotate-y-0 {
        0% { transform: rotateY(180deg); }
        100% { transform: rotateY(0deg); }
      }
      
      @keyframes float-up {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
      }
      
      @keyframes bounce-once {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse-slow {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
      
      .rotate-y-0 {
        transform: rotateY(0deg);
      }
      
      .animate-bounce-once {
        animation: bounce-once 0.6s ease-in-out;
      }
      
      .animate-pulse-slow {
        animation: pulse-slow 2s ease-in-out infinite;
      }
      `}
    </style>
  );
};

export default PouGame;
