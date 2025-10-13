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
import { MenstrualGame } from "./MenstrualGame";
import { PostMenstrualGame } from "./PostMenstrualGame";
import { MenopauseGame } from "./MenopauseGame";
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

// Universal questions for all user types (nickname and age)
const universalQuestions: Question[] = [
  {
    id: 'nickname',
    text: "What's your favourite nickname?",
    type: 'single',
    emoji: '✨',
    options: []
  },
  {
    id: 'age',
    text: 'How old are you?',
    type: 'single',
    emoji: '🎂',
    options: []
  }
];

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

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { logout } = useCustomAuth();
  const { addResponse, saveQuestionnaire } = useQuestionnaire();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({});
  const [showUniversalQuestions, setShowUniversalQuestions] = useState(false);
  const [universalQuestionIndex, setUniversalQuestionIndex] = useState(0);
  const [showHealthQuestions, setShowHealthQuestions] = useState(false);
  const [showTypeQuestions, setShowTypeQuestions] = useState(false);
  const [showPreMenstrualGame, setShowPreMenstrualGame] = useState(false);
  const [showMenopauseGame, setShowMenopauseGame] = useState(false);
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
    if (showUniversalQuestions && universalQuestions.length > 0) {
      return universalQuestions[universalQuestionIndex];
    }
    if (showTypeQuestions && currentQuestions.length > 0) {
      return currentQuestions[typeQuestionIndex];
    }
    return null;
  };

  const getTotalSteps = (): number => {
    if (currentStep === 0) return 1;
    return 1 + universalQuestions.length + 1 + currentQuestions.length; // First question + universal questions + health questions + type questions
  };

  const getCurrentStepNumber = (): number => {
    if (currentStep === 0) return 1;
    if (showUniversalQuestions) return 1 + universalQuestionIndex + 1; // Universal questions start from step 2
    if (showHealthQuestions) return 1 + universalQuestions.length + 1; // Health questions after universal
    if (showTypeQuestions) return 1 + universalQuestions.length + 1 + typeQuestionIndex + 1; // Type questions after health
    return 1;
  };

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
          break;
      }
      
      setCurrentQuestions(typeQuestions);
      setCurrentStep(1);
      setShowUniversalQuestions(true);
      setUniversalQuestionIndex(0);
    } else if (showUniversalQuestions) {
      if (universalQuestionIndex < universalQuestions.length - 1) {
        setUniversalQuestionIndex(prev => prev + 1);
      } else {
        setShowUniversalQuestions(false);
        setShowHealthQuestions(true);
      }
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
          setShowMenopauseGame(true);
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

  const handleMenopauseGameComplete = () => {
    setShowMenopauseGame(false);
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

  // Show Menopause Game for POST_MENSTRUAL users
  if (showMenopauseGame) {
    const symptomResponses = getAllSymptomIds().reduce((acc, symptomId) => {
      if (responses[symptomId] !== undefined) {
        acc[symptomId] = responses[symptomId] as number;
      }
      return acc;
    }, {} as Record<string, number>);

    return <MenopauseGame onComplete={handleMenopauseGameComplete} symptomResponses={symptomResponses} />;
  }

  // Show Pre-Menstrual Game for PRE_PERIOD users
  if (showPreMenstrualGame) {
    return <PreMenstrualGame onComplete={handlePreMenstrualGameComplete} />;
  }

  // Show Menstrual Game for MENSTRUAL users
  if (showMenstrualGame) {
    return <MenstrualGame onComplete={handleMenstrualGameComplete} />;
  }

  if (showUniversalQuestions) {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    const totalSteps = getTotalSteps();
    const currentStepNum = getCurrentStepNumber();
    const progress = (currentStepNum / totalSteps) * 100;
    const isTextInput = currentQuestion.id === 'nickname';
    const isNumberInput = currentQuestion.id === 'age';

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

          <CardContent className="space-y-6">
            {isTextInput && (
              <div className="space-y-4">
                <input
                  type="text"
                  id="nickname-input"
                  placeholder="Enter your nickname..."
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleAnswer(e.currentTarget.value.trim());
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('nickname-input') as HTMLInputElement;
                    if (input?.value.trim()) {
                      handleAnswer(input.value.trim());
                    }
                  }}
                  className="w-full rounded-full"
                >
                  Continue
                </Button>
              </div>
            )}

            {isNumberInput && (
              <div className="space-y-4">
                <input
                  type="number"
                  id="age-input"
                  placeholder="Enter your age..."
                  min="8"
                  max="120"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      handleAnswer(e.currentTarget.value);
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('age-input') as HTMLInputElement;
                    if (input?.value) {
                      handleAnswer(input.value);
                    }
                  }}
                  className="w-full rounded-full"
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
