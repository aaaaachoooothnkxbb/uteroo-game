
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Sparkles, UtensilsCrossed } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

interface PhaseRecipeInfo {
  phase: Phase;
  keyGoals: string;
  foodCategories: {
    name: string;
    percentage: number;
    sources: string;
    why: string;
    color: string;
  }[];
}

const phaseRecipes: Record<Phase, PhaseRecipeInfo> = {
  menstruation: {
    phase: "menstruation",
    keyGoals: "Replenish iron, reduce inflammation, support detox",
    foodCategories: [
      {
        name: "Iron-Rich Foods",
        percentage: 40,
        sources: "Red meat, lentils, spinach, blackstrap molasses",
        why: "Compensates for blood loss (NIH, 2021)",
        color: "#F87171" // red
      },
      {
        name: "Omega-3s",
        percentage: 25,
        sources: "Salmon, chia seeds, walnuts",
        why: "Lowers prostaglandins (pain triggers) (AJCN, 2019)",
        color: "#60A5FA" // blue
      },
      {
        name: "Complex Carbs",
        percentage: 20,
        sources: "Sweet potatoes, quinoa",
        why: "Stabilizes serotonin (mood) during estrogen drop (NCBI, 2020)",
        color: "#FBBF24" // yellow
      },
      {
        name: "Probiotics",
        percentage: 15,
        sources: "Yogurt, kimchi",
        why: "Gut health modulates estrogen excretion (Front. Endocrinol., 2022)",
        color: "#34D399" // green
      }
    ]
  },
  follicular: {
    phase: "follicular",
    keyGoals: "Support estrogen rise, energy, and follicle development",
    foodCategories: [
      {
        name: "Cruciferous Veggies & Leafy Greens",
        percentage: 35,
        sources: "Broccoli, kale, arugula",
        why: "Indole-3-carbinol aids estrogen metabolism (J. Nutr., 2020)",
        color: "#10B981" // green
      },
      {
        name: "Lean Protein",
        percentage: 30,
        sources: "Chicken, tofu, tempeh",
        why: "Provides amino acids for tissue repair (Int. J. Sport Nutr., 2018)",
        color: "#F87171" // red
      },
      {
        name: "Seeds & Nuts",
        percentage: 25,
        sources: "Flaxseeds, pumpkin seeds",
        why: "Lignans modulate estrogen (J. Clin. Endocrinol. Metab., 2021)",
        color: "#FBBF24" // yellow
      },
      {
        name: "Citrus",
        percentage: 10,
        sources: "Oranges, lemons",
        why: "Vitamin C boosts iron absorption (NIH, 2022)",
        color: "#FCD34D" // light yellow
      }
    ]
  },
  ovulatory: {
    phase: "ovulatory",
    keyGoals: "Reduce inflammation, support libido",
    foodCategories: [
      {
        name: "Antioxidant-Rich Foods",
        percentage: 40,
        sources: "Berries, dark chocolate, artichokes",
        why: "Counters oxidative stress from estrogen peak (Oxid. Med. Cell. Longev., 2020)",
        color: "#EC4899" // pink
      },
      {
        name: "Fiber",
        percentage: 30,
        sources: "Raspberries, avocados",
        why: "Binds excess estrogen for excretion (Am. J. Clin. Nutr., 2019)",
        color: "#10B981" // green
      },
      {
        name: "Zinc Sources",
        percentage: 20,
        sources: "Oysters, cashews",
        why: "Supports progesterone conversion (Nutrients, 2021)",
        color: "#A1A1AA" // gray
      },
      {
        name: "Spices",
        percentage: 10,
        sources: "Turmeric, cinnamon",
        why: "Anti-inflammatory (J. Endocr. Soc., 2021)",
        color: "#F97316" // orange
      }
    ]
  },
  luteal: {
    phase: "luteal",
    keyGoals: "Balance progesterone, stabilize mood, curb cravings",
    foodCategories: [
      {
        name: "Magnesium-Rich Foods",
        percentage: 35,
        sources: "Dark leafy greens, almonds, dark chocolate",
        why: "Eases PMS and supports progesterone (PLoS One, 2020)",
        color: "#10B981" // green
      },
      {
        name: "Healthy Fats",
        percentage: 30,
        sources: "Avocados, olive oil, ghee",
        why: "Cholesterol is a progesterone precursor (Endocrine Reviews, 2018)",
        color: "#FBBF24" // yellow
      },
      {
        name: "B-Vitamin Foods",
        percentage: 25,
        sources: "Eggs, nutritional yeast",
        why: "B6 boosts serotonin (mood) (J. Women's Health, 2022)",
        color: "#60A5FA" // blue
      },
      {
        name: "Bitter Greens",
        percentage: 10,
        sources: "Dandelion greens, arugula",
        why: "Supports liver detox of excess hormones (Nutr. Res., 2019)",
        color: "#34D399" // green
      }
    ]
  }
};

interface Recipe {
  id: string;
  recipe_name: string;
  phase: Phase;
  ingredients: string[];
  instructions: string[];
  bonus_ingredients: string[];
  cooking_tips: string[];
}

export const PhaseRecipeRoulette = ({ phase }: { phase: Phase }) => {
  const [showRecipeWheel, setShowRecipeWheel] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [spinningWheel, setSpinningWheel] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const { toast } = useToast();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["phase-recipes", phase],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipe_roulette")
        .select("*")
        .eq("phase", phase);

      if (error) throw error;
      return data as Recipe[];
    },
  });

  const getRandomRecipe = () => {
    if (!recipes || recipes.length === 0) return null;
    return recipes[Math.floor(Math.random() * recipes.length)];
  };

  const handleSpinWheel = () => {
    setSpinningWheel(true);
    // Generate random rotation between 1800 and 3600 degrees (5-10 full spins)
    const newRotation = wheelRotation + 1800 + Math.random() * 1800;
    setWheelRotation(newRotation);
    
    setTimeout(() => {
      setSpinningWheel(false);
      const recipe = getRandomRecipe();
      setSelectedRecipe(recipe);
      setShowRecipeDetails(true);
      
      toast({
        title: "🍲 Recipe Found!",
        description: `Your perfect ${phase} phase recipe is ready!`,
      });
    }, 3000); // Match this with CSS animation duration
  };

  const phaseColors = {
    menstruation: "from-menstruation-primary to-menstruation-light",
    follicular: "from-follicular-primary to-follicular-light",
    ovulatory: "from-ovulatory-primary to-ovulatory-light",
    luteal: "from-luteal-primary to-luteal-light"
  };
  
  // Create roulette wheel segments
  const createRouletteWheel = () => {
    const foodCategories = phaseRecipes[phase].foodCategories;
    let cumulativePercentage = 0;
    
    return (
      <div className="relative w-64 h-64 mx-auto mt-4 mb-6">
        {/* Spinning wheel */}
        <div 
          className={`absolute w-full h-full rounded-full overflow-hidden transition-transform duration-3000 ease-out ${spinningWheel ? '' : 'transform'}`}
          style={{ 
            transform: `rotate(${wheelRotation}deg)`,
            transition: spinningWheel ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
          }}
        >
          {foodCategories.map((category, index) => {
            const startAngle = (cumulativePercentage / 100) * 360;
            cumulativePercentage += category.percentage;
            const endAngle = (cumulativePercentage / 100) * 360;
            
            return (
              <div 
                key={index}
                className="absolute inset-0"
                style={{
                  clipPath: `path('M 160,160 L 160,0 A 160,160 0 ${startAngle > 180 ? 1 : 0},1 ${
                    160 + 160 * Math.cos((endAngle * Math.PI) / 180)
                  },${
                    160 - 160 * Math.sin((endAngle * Math.PI) / 180)
                  } Z')`,
                  backgroundColor: category.color,
                }}
              >
                {/* Category label */}
                <div 
                  className="absolute left-1/2 top-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${startAngle + (endAngle - startAngle) / 2}deg) translateY(-70px) rotate(-${startAngle + (endAngle - startAngle) / 2}deg)`,
                  }}
                >
                  <div className="text-xs font-bold text-white bg-black/30 px-1 py-0.5 rounded-sm w-max mx-auto truncate max-w-[120px]">
                    {category.name}
                  </div>
                  <div className="text-xs font-bold text-white">{category.percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Center pin */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
          <ChefHat className="h-5 w-5 text-pink-500" />
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 w-4 h-8 -translate-x-1/2 z-10">
          <div className="w-4 h-4 bg-white transform rotate-45 shadow-lg"></div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Recipe Roulette Icon with Shining Effect */}
      <div 
        className="relative cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() => setShowRecipeWheel(true)}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r animate-pulse opacity-40 blur-sm from-pink-400 via-purple-500 to-indigo-500" />
        <div className="absolute inset-0 rotate-45 rounded-full bg-gradient-to-r animate-pulse opacity-40 blur-sm from-yellow-400 via-red-500 to-pink-500" />
        
        <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2">
          <img 
            src="/lovable-uploads/8621b2b5-4f0d-4de1-8415-fadb4bb0eabe.png" 
            alt="Recipe Roulette" 
            className="w-full h-full object-contain"
          />
          
          <div className="absolute top-1 right-1">
            <Sparkles className="h-3 w-3 text-yellow-500 animate-bounce" />
          </div>
        </div>
        
        <div className="absolute -top-1 -right-1 z-20">
          <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 opacity-75"></div>
          <div className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></div>
        </div>
      </div>

      {/* Recipe Wheel Modal */}
      <Dialog open={showRecipeWheel} onOpenChange={setShowRecipeWheel}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-orange-500" />
              <span className={`bg-gradient-to-r ${phaseColors[phase]} bg-clip-text text-transparent`}>
                Phase-Specific Recipe Roulette
              </span>
            </DialogTitle>
            <DialogDescription>
              Discover recipes optimized for your {phase} phase needs
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-4">
            <div className="text-center">
              <h3 className="font-bold">Key Goals for {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase:</h3>
              <p className="text-gray-600">{phaseRecipes[phase].keyGoals}</p>
            </div>
            
            {/* Roulette Wheel */}
            {createRouletteWheel()}
            
            <div className="space-y-3 mt-4">
              <h3 className="font-medium">Recommended Food Distribution:</h3>
              {phaseRecipes[phase].foodCategories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <Progress 
                    value={category.percentage} 
                    className="bg-gray-200"
                    indicatorClassName="transition-all"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{category.sources}</span>
                    <button 
                      className="text-blue-500 hover:underline"
                      onClick={() => toast({
                        title: category.name,
                        description: category.why,
                      })}
                    >
                      Why?
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleSpinWheel}
                disabled={spinningWheel || isLoading}
                className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-full"
              >
                {spinningWheel ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    <span>Spinning...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    <span>Spin for Recipe</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recipe Details Modal */}
      <Dialog open={showRecipeDetails} onOpenChange={setShowRecipeDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-orange-500" />
              <span className={`bg-gradient-to-r ${phaseColors[phase]} bg-clip-text text-transparent`}>
                {selectedRecipe?.recipe_name || "Phase Recipe"}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecipe && (
            <div className="p-4 space-y-6">
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem>
                    <div className="p-4">
                      <h4 className="font-medium text-lg mb-2">Ingredients:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-gray-700">{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  </CarouselItem>
                  
                  <CarouselItem>
                    <div className="p-4">
                      <h4 className="font-medium text-lg mb-2">Bonus Ingredients (Phase-Specific):</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedRecipe.bonus_ingredients.map((ingredient, index) => (
                          <li key={index} className="text-green-600">{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  </CarouselItem>
                  
                  <CarouselItem>
                    <div className="p-4">
                      <h4 className="font-medium text-lg mb-2">Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-2">
                        {selectedRecipe.instructions.map((step, index) => (
                          <li key={index} className="text-gray-700">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </CarouselItem>
                  
                  <CarouselItem>
                    <div className="p-4">
                      <h4 className="font-medium text-lg mb-2">Cooking Tips:</h4>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside space-y-1">
                          {selectedRecipe.cooking_tips.map((tip, index) => (
                            <li key={index} className="text-gray-700">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
