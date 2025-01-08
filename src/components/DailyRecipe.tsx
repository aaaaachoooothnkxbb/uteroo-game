import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, ChefHat } from "lucide-react";

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

export const DailyRecipe = ({ phase = "menstruation" }) => {
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const { toast } = useToast();
  const recipe = recipes[phase];

  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
    toast({
      title: "Recipe photo uploaded!",
      description: "You earned 15 points for completing today's recipe challenge!",
    });
  };

  return (
    <Card className={`p-6 bg-${phase}-bg border-${phase}-primary max-w-md mx-auto`}>
      <div className="space-y-4">
        <h3 className={`text-xl font-medium text-${phase}-primary flex items-center gap-2`}>
          <ChefHat className="w-5 h-5" />
          Today's Recipe: {recipe.name}
        </h3>

        <div className="space-y-2">
          <h4 className="font-medium">Ingredients:</h4>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-600">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-600">{instruction}</li>
            ))}
          </ol>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Benefits:</strong> {recipe.benefits}
          </p>
        </div>

        <Button
          onClick={handlePhotoUpload}
          disabled={photoUploaded}
          className={`w-full bg-${phase}-primary hover:bg-${phase}-secondary`}
        >
          <Camera className="w-4 h-4 mr-2" />
          {photoUploaded ? "Photo Uploaded!" : "Share Your Creation"}
        </Button>
      </div>
    </Card>
  );
};