import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, ChefHat, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type Recipe = {
  name: string;
  ingredients: string[];
  instructions: string[];
  benefits: string;
  phase: string;
};

const recipes: Record<string, Recipe> = {
  menstruation: {
    name: "Iron-Rich Smoothie Bowl",
    ingredients: [
      "1 cup spinach",
      "1 banana",
      "1 cup mixed berries",
      "1 tbsp chia seeds",
      "1 cup almond milk"
    ],
    instructions: [
      "Blend spinach and almond milk until smooth",
      "Add banana and berries, blend again",
      "Pour into a bowl",
      "Top with chia seeds"
    ],
    benefits: "Rich in iron to combat period fatigue",
    phase: "menstruation"
  },
  follicular: {
    name: "Energy Boost Bowl",
    ingredients: [
      "1 cup quinoa",
      "2 cups mixed vegetables",
      "1 avocado",
      "2 tbsp olive oil",
      "Lemon juice"
    ],
    instructions: [
      "Cook quinoa according to package",
      "Roast vegetables with olive oil",
      "Combine in a bowl",
      "Top with sliced avocado and lemon"
    ],
    benefits: "Complex carbs for sustained energy",
    phase: "follicular"
  },
  ovulatory: {
    name: "Hormone Balance Bowl",
    ingredients: [
      "2 cups leafy greens",
      "1 sweet potato",
      "1/2 cup chickpeas",
      "Seeds mix",
      "Tahini dressing"
    ],
    instructions: [
      "Roast sweet potato and chickpeas",
      "Prepare fresh greens",
      "Combine all ingredients",
      "Drizzle with tahini dressing"
    ],
    benefits: "Supports hormone balance and energy",
    phase: "ovulatory"
  },
  luteal: {
    name: "Calming Chocolate Oats",
    ingredients: [
      "1 cup oats",
      "1 tbsp cacao powder",
      "1 banana",
      "Cinnamon",
      "Almond milk"
    ],
    instructions: [
      "Cook oats with almond milk",
      "Stir in cacao powder",
      "Top with sliced banana",
      "Sprinkle with cinnamon"
    ],
    benefits: "Magnesium-rich to reduce cravings",
    phase: "luteal"
  }
};

interface DailyRecipeProps {
  phase?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const DailyRecipe = ({ 
  phase = "menstruation",
  onComplete,
  isCompleted = false
}: DailyRecipeProps) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const recipe = recipes[phase];

  const toggleStep = (index: number) => {
    if (isCompleted) return;
    
    setCompletedSteps(prev => {
      const newSteps = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      if (newSteps.length === recipe.instructions.length) {
        toast({
          title: "Great job!",
          description: "You've completed today's recipe challenge.",
        });
        onComplete?.();
      }
      return newSteps;
    });
  };

  return (
    <Card className={`p-6 bg-${phase}-bg border-${phase}-primary max-w-md mx-auto ${
      isCompleted ? "bg-opacity-50" : ""
    }`}>
      <div className="space-y-4">
        <h3 className={`text-xl font-medium text-${phase}-primary flex items-center gap-2`}>
          <ChefHat className="w-5 h-5" />
          Today's Recipe: {recipe.name}
          {isCompleted && <Check className="w-5 h-5 text-green-500" />}
        </h3>

        <div className="space-y-2">
          <h4 className="font-medium text-black">Ingredients:</h4>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-black">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-black">Instructions:</h4>
          <div className="space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`step-${index}`}
                  checked={completedSteps.includes(index) || isCompleted}
                  onCheckedChange={() => toggleStep(index)}
                  disabled={isCompleted}
                />
                <label
                  htmlFor={`step-${index}`}
                  className={`text-black cursor-pointer ${
                    completedSteps.includes(index) || isCompleted ? "line-through opacity-70" : ""
                  }`}
                >
                  {instruction}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md">
          <p className="text-sm text-black">
            <strong>Benefits:</strong> {recipe.benefits}
          </p>
        </div>

        <Button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full bg-${phase}-primary hover:bg-${phase}-secondary text-white`}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isCompleted ? "Photo Uploaded!" : "Share Your Creation"}
        </Button>
      </div>
    </Card>
  );
};