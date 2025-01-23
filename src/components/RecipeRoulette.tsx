import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Dice } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Recipe {
  recipe_name: string;
  ingredients: string[];
  instructions: string[];
  bonus_ingredients: string[];
  cooking_tips: string[];
}

export const RecipeRoulette = ({ phase }: { phase: string }) => {
  const [showRecipe, setShowRecipe] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const { toast } = useToast();

  const { data: recipes, refetch } = useQuery({
    queryKey: ['recipe-roulette', phase],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_roulette')
        .select('*')
        .eq('phase', phase);

      if (error) throw error;
      return data as Recipe[];
    }
  });

  const handleSpin = async () => {
    setIsSpinning(true);
    await refetch();
    setTimeout(() => {
      setIsSpinning(false);
      setShowRecipe(true);
      toast({
        title: "🎲 Recipe Found!",
        description: "Your perfect recipe match has been selected.",
      });
    }, 1500);
  };

  const currentRecipe = recipes?.[Math.floor(Math.random() * recipes.length)];

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-medium">Recipe Roulette</h3>
          </div>
          <Button
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Dice className={`w-4 h-4 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
            Spin for Recipe
          </Button>
        </div>
      </Card>

      <Dialog open={showRecipe} onOpenChange={setShowRecipe}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentRecipe?.recipe_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {currentRecipe?.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Bonus Ingredients:</h4>
              <ul className="list-disc list-inside text-green-600">
                {currentRecipe?.bonus_ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside">
                {currentRecipe?.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Cooking Tips:</h4>
              <ul className="list-disc list-inside">
                {currentRecipe?.cooking_tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};