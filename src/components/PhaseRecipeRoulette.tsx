
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Apple, Carrot, Egg, Leaf } from "lucide-react";
import { audioService } from "@/utils/audioService";

// Define the phase-specific biases for different food categories
const HORMONE_PHASES = {
  menstruation: { 
    bias: { vegetables: 0.3, proteins: 0.4 }, 
    color: '#FF6B9D',
    emoji: '🌸'
  },
  follicular: { 
    bias: { proteins: 0.5, carbs: 0.2 }, 
    color: '#7EC4CF',
    emoji: '🌱'
  },
  ovulatory: { 
    bias: { vegetables: 0.6, proteins: 0.3 }, 
    color: '#FFD166',
    emoji: '☀️'
  },
  luteal: { 
    bias: { sweets: 0.3, carbs: 0.4 }, 
    color: '#9B5DE5',
    emoji: '🍂'
  }
};

// Define the food ingredients categories
const INGREDIENTS = {
  vegetables: [
    { name: 'Broccoli', emoji: '🥦', benefit: 'Estrogen balance', icon: <Leaf className="h-5 w-5" /> },
    { name: 'Spinach', emoji: '🍃', benefit: 'Iron boost', icon: <Carrot className="h-5 w-5" /> },
    { name: 'Kale', emoji: '🥬', benefit: 'Vitamin K', icon: <Leaf className="h-5 w-5" /> },
    { name: 'Avocado', emoji: '🥑', benefit: 'Healthy fats', icon: <Apple className="h-5 w-5" /> },
  ],
  proteins: [
    { name: 'Salmon', emoji: '🐟', benefit: 'Omega-3', icon: <Egg className="h-5 w-5" /> },
    { name: 'Eggs', emoji: '🥚', benefit: 'Complete protein', icon: <Egg className="h-5 w-5" /> },
    { name: 'Lentils', emoji: '🍲', benefit: 'Iron & protein', icon: <Apple className="h-5 w-5" /> },
    { name: 'Greek Yogurt', emoji: '🥛', benefit: 'Probiotics', icon: <Apple className="h-5 w-5" /> },
  ],
  carbs: [
    { name: 'Sweet Potato', emoji: '🍠', benefit: 'Complex carbs', icon: <Carrot className="h-5 w-5" /> },
    { name: 'Quinoa', emoji: '🌾', benefit: 'Complete grain', icon: <Apple className="h-5 w-5" /> },
    { name: 'Oats', emoji: '🥣', benefit: 'Sustained energy', icon: <Apple className="h-5 w-5" /> },
    { name: 'Brown Rice', emoji: '🍚', benefit: 'Fiber rich', icon: <Apple className="h-5 w-5" /> },
  ],
  sweets: [
    { name: 'Dark Chocolate', emoji: '🍫', benefit: 'Antioxidants', icon: <Apple className="h-5 w-5" /> },
    { name: 'Berries', emoji: '🍓', benefit: 'Low glycemic', icon: <Apple className="h-5 w-5" /> },
    { name: 'Dates', emoji: '🌴', benefit: 'Natural sweetener', icon: <Apple className="h-5 w-5" /> },
    { name: 'Honey', emoji: '🍯', benefit: 'Anti-inflammatory', icon: <Apple className="h-5 w-5" /> },
  ]
};

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  hormoneTip: string;
  image?: string;
}

interface PhaseRecipeRouletteProps {
  phase: string;
}

const getPhaseEnemies = (phase: string) => {
  const enemies = {
    menstruation: "cramps and fatigue",
    follicular: "brain fog and low energy",
    ovulatory: "bloating and sensitivity",
    luteal: "mood swings and cravings"
  };
  return enemies[phase as keyof typeof enemies] || "hormonal imbalance";
};

export const PhaseRecipeRoulette = ({ phase }: PhaseRecipeRouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const phaseColor = HORMONE_PHASES[phase as keyof typeof HORMONE_PHASES]?.color || '#9B87F5';
  const phaseEmoji = HORMONE_PHASES[phase as keyof typeof HORMONE_PHASES]?.emoji || '🍽️';

  const applyPhaseBias = () => {
    const phaseBiases = HORMONE_PHASES[phase as keyof typeof HORMONE_PHASES]?.bias || {};
    
    // Create a weighted selection of ingredients
    let allWeightedItems: { name: string; emoji: string; benefit: string; icon: JSX.Element; category: string; weight: number; }[] = [];
    
    Object.entries(INGREDIENTS).forEach(([category, items]) => {
      const bias = phaseBiases[category as keyof typeof phaseBiases] || 0;
      
      items.forEach(item => {
        allWeightedItems.push({
          ...item,
          category,
          weight: Math.random() + bias
        });
      });
    });
    
    // Sort by weight and take top items
    allWeightedItems.sort((a, b) => b.weight - a.weight);
    
    // Select top items from different categories
    const selected = [];
    const categories = new Set();
    
    for (const item of allWeightedItems) {
      if (!categories.has(item.category)) {
        selected.push(item);
        categories.add(item.category);
      }
      
      if (selected.length >= 4) break;
    }
    
    return selected;
  };

  const generateRecipe = (ingredients: any[]) => {
    const mainIngredient = ingredients[0];
    const secondaryIngredients = ingredients.slice(1);
    
    const getRandomInstructions = () => {
      const instructions = [
        `Prepare the ${mainIngredient.name} by washing thoroughly.`,
        `Combine ${ingredients.map(i => i.name).join(", ")} in a bowl.`,
        `Cook over medium heat for 10-15 minutes.`,
        `Add your favorite herbs and seasonings.`,
        `Let sit for 5 minutes before serving.`,
      ];
      return instructions;
    };

    return {
      title: `${phaseEmoji} ${mainIngredient.name} Power Bowl`,
      ingredients: ingredients.map(i => `${i.emoji} ${i.name} (${i.benefit})`),
      instructions: getRandomInstructions(),
      hormoneTip: `This combination helps support your ${phase} phase and fights ${getPhaseEnemies(phase)}!`
    };
  };

  const handleSpin = () => {
    // Play spin sound
    audioService.play('click');
    
    setIsSpinning(true);
    
    // Generate random angle between 1440 and 1800 degrees (4-5 full spins)
    const angle = 1440 + Math.floor(Math.random() * 360);
    setSpinAngle(angle);
    
    // Select ingredients with phase bias
    const selected = applyPhaseBias();
    setSelectedIngredients(selected);
    
    setTimeout(() => {
      setIsSpinning(false);
      
      // Play success sound
      audioService.play('bonus');
      
      // Generate and display recipe
      const recipe = generateRecipe(selected);
      setCurrentRecipe(recipe);
      setShowRecipe(true);
      
      toast({
        title: "🎲 Recipe Found!",
        description: `Your perfect ${phase} phase recipe is ready!`,
      });
    }, 3000);
  };

  return (
    <>
      <Card 
        className="overflow-hidden relative"
        style={{ 
          background: `linear-gradient(135deg, ${phaseColor}30, white)`,
          borderColor: phaseColor
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" style={{ color: phaseColor }} />
              <h3 className="text-base font-medium">Phase Recipe Roulette</h3>
            </div>
            
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              className="transition-all duration-300"
              style={{ 
                backgroundColor: isSpinning ? '#999' : phaseColor,
                transform: isSpinning ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <div className="flex items-center gap-1">
                <span 
                  className={`transition-transform duration-700 ${
                    isSpinning ? 'animate-spin' : ''
                  }`}
                >
                  🎲
                </span>
                <span>{isSpinning ? 'Spinning...' : 'Spin for Recipe'}</span>
              </div>
            </Button>
          </div>
          
          <div 
            ref={wheelRef} 
            className="relative mx-auto w-64 h-64 mb-4 flex items-center justify-center"
          >
            {/* Roulette Wheel */}
            <div 
              className="absolute w-full h-full rounded-full transform transition-transform duration-[3000ms] ease-out"
              style={{ 
                transform: `rotate(${spinAngle}deg)`,
                backgroundImage: `conic-gradient(
                  #FF6B9D 0% 25%, 
                  #7EC4CF 25% 50%, 
                  #FFD166 50% 75%, 
                  #9B5DE5 75% 100%
                )`,
                boxShadow: '0 0 10px rgba(0,0,0,0.2) inset'
              }}
            >
              {/* Inner circles */}
              <div className="absolute inset-2.5 rounded-full bg-white/60"></div>
              <div className="absolute inset-10 rounded-full bg-white/80"></div>
              <div className="absolute inset-20 rounded-full bg-white"></div>
            </div>
            
            {/* Center decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white z-10 border-4 flex items-center justify-center shadow-md"
              style={{ borderColor: phaseColor }}
            >
              <span className="text-2xl">{phaseEmoji}</span>
            </div>
            
            {/* Selection indicator */}
            <div 
              className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 text-xl"
              style={{ color: isSpinning ? 'red' : 'black' }}
            >
              ▶
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showRecipe} onOpenChange={setShowRecipe}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: phaseColor }}>
              <ChefHat className="w-6 h-6" />
              {currentRecipe?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-4">
            <div className="flex -space-x-3 mb-4">
              {selectedIngredients.map((ingredient, idx) => (
                <div 
                  key={idx} 
                  className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center shadow-md"
                >
                  <span className="text-lg">{ingredient.emoji}</span>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-medium text-lg mb-2">Main Ingredients:</h4>
              <ul className="list-disc list-inside space-y-1">
                {currentRecipe?.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-2">
                {currentRecipe?.instructions.map((step, index) => (
                  <li key={index} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${phaseColor}20` }}
            >
              <h4 className="font-medium text-lg mb-2">Hormone Tip:</h4>
              <p className="text-gray-700">{currentRecipe?.hormoneTip}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
