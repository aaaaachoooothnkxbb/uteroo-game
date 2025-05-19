
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Dice1 } from "lucide-react";
import { audioService } from "@/utils/audioService";

interface Recipe {
  recipe_name: string;
  ingredients: string[];
  instructions: string[];
  bonus_ingredients: string[];
  cooking_tips: string[];
  phase: string;
}

export const RecipeRoulette = ({ phase = "menstruation" }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const { toast } = useToast();

  const { data: recipes } = useQuery({
    queryKey: ["recipes", phase],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipe_roulette")
        .select("*")
        .eq("phase", phase);

      if (error) throw error;
      return data as Recipe[];
    },
  });

  const handleSpin = () => {
    // Play spin sound
    audioService.play('click');
    
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setShowRecipe(true);
      
      // Play success sound
      audioService.play('bonus');
      
      toast({
        title: "🎲 Recipe Found!",
        description: "Your perfect recipe match has been selected.",
      });
    }, 2000);
  };

  const currentRecipe = recipes?.[Math.floor(Math.random() * recipes.length)];

  return (
    <>
      <Card className="p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-medium">Recipe Roulette</h3>
          </div>
          <Button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`bg-orange-500 hover:bg-orange-600 transition-all duration-300 ${
              isSpinning ? 'scale-110' : ''
            }`}
          >
            <Dice1 
              className={`w-4 h-4 mr-2 transition-transform duration-700 ${
                isSpinning ? 'animate-[spin_0.5s_linear_infinite]' : ''
              }`} 
            />
            {isSpinning ? 'Spinning...' : 'Spin for Recipe'}
          </Button>
        </div>
        {isSpinning && (
          <div className="absolute inset-0 bg-orange-50/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-2xl font-bold text-orange-500 animate-bounce">
              Finding your perfect recipe...
            </div>
          </div>
        )}
      </Card>

      <Dialog open={showRecipe} onOpenChange={setShowRecipe}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              {currentRecipe?.recipe_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div>
              <h4 className="font-medium text-lg mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside space-y-1">
                {currentRecipe?.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Bonus Ingredients:</h4>
              <ul className="list-disc list-inside space-y-1">
                {currentRecipe?.bonus_ingredients.map((ingredient, index) => (
                  <li key={index} className="text-green-600">{ingredient}</li>
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

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-lg mb-2">Cooking Tips:</h4>
              <ul className="list-disc list-inside space-y-1">
                {currentRecipe?.cooking_tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
