
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { audioService } from "@/utils/audioService";
import { ScrollArea } from "@/components/ui/scroll-area";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  isChecked: boolean;
}

interface KitchenRoomInteractionProps {
  currentPhase: Phase;
  updateStreak: () => void;
}

// Grocery lists by phase
const groceryListsByPhase: Record<Phase, { goal: string; items: Omit<GroceryItem, 'isChecked'>[], enemies: string[] }> = {
  menstruation: {
    goal: "Reduce cramps, replenish iron.",
    enemies: ["Cramp Monster", "Fatigue Ghost"],
    items: [
      { id: "dark_chocolate", name: "Dark chocolate (85%)", quantity: "100g" },
      { id: "spinach", name: "Spinach (fresh/frozen)", quantity: "500g" },
      { id: "lentils", name: "Lentils", quantity: "400g can" },
      { id: "ginger", name: "Ginger root", quantity: "1 knob" },
      { id: "pumpkin_seeds", name: "Pumpkin seeds", quantity: "200g" },
      { id: "chamomile", name: "Chamomile tea", quantity: "20 bags" },
      { id: "bananas", name: "Bananas", quantity: "5" },
      { id: "lean_beef", name: "Lean beef", quantity: "300g" },
      { id: "oranges", name: "Oranges", quantity: "4" },
      { id: "heating_pad", name: "Heating pad", quantity: "1 (non-food but essential!)" },
    ]
  },
  follicular: {
    goal: "Boost energy, support estrogen.",
    enemies: ["Brain Fog", "Low Stamina"],
    items: [
      { id: "salmon", name: "Salmon fillet", quantity: "2 servings" },
      { id: "flaxseeds", name: "Flaxseeds", quantity: "150g" },
      { id: "broccoli", name: "Broccoli", quantity: "2 heads" },
      { id: "quinoa", name: "Quinoa", quantity: "500g" },
      { id: "blueberries", name: "Blueberries", quantity: "250g" },
      { id: "almonds", name: "Almonds", quantity: "200g" },
      { id: "green_tea", name: "Green tea", quantity: "15 bags" },
      { id: "greek_yogurt", name: "Greek yogurt", quantity: "3 cups" },
      { id: "eggs", name: "Eggs", quantity: "6" },
      { id: "turmeric", name: "Turmeric", quantity: "50g" },
    ]
  },
  ovulatory: {
    goal: "Sustain energy, reduce bloating.",
    enemies: ["Bloating Blob", "Social Anxiety"],
    items: [
      { id: "cucumber", name: "Cucumber", quantity: "2" },
      { id: "celery", name: "Celery", quantity: "1 bunch" },
      { id: "lemon", name: "Lemon", quantity: "3" },
      { id: "avocado", name: "Avocado", quantity: "2" },
      { id: "walnuts", name: "Walnuts", quantity: "150g" },
      { id: "peppermint", name: "Peppermint tea", quantity: "10 bags" },
      { id: "chicken", name: "Chicken breast", quantity: "400g" },
      { id: "sweet_potato", name: "Sweet potato", quantity: "3" },
      { id: "fennel", name: "Fennel", quantity: "1 bulb" },
      { id: "coconut_water", name: "Coconut water", quantity: "1L" },
    ]
  },
  luteal: {
    goal: "Balance mood, curb cravings.",
    enemies: ["Mood Swing Gremlin", "Sugar Demon"],
    items: [
      { id: "leafy_greens", name: "Dark leafy greens", quantity: "300g" },
      { id: "chickpeas", name: "Chickpeas", quantity: "400g can" },
      { id: "dark_cherries", name: "Dark cherries", quantity: "200g" },
      { id: "oats", name: "Oats", quantity: "500g" },
      { id: "cashews", name: "Cashews", quantity: "150g" },
      { id: "magnesium", name: "Magnesium flakes", quantity: "1kg (for baths)" },
      { id: "turkey", name: "Turkey slices", quantity: "200g" },
      { id: "rye_bread", name: "Dark rye bread", quantity: "1 loaf" },
      { id: "cinnamon", name: "Cinnamon", quantity: "1 jar" },
      { id: "herbal_tea", name: "Herbal sleep tea", quantity: "10 bags" },
    ]
  }
};

export function KitchenRoomInteraction({ currentPhase, updateStreak }: KitchenRoomInteractionProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'food' | 'hydration' | 'grocery'>('food');
  const [foodSelected, setFoodSelected] = useState<string | null>(null);
  const [waterGlasses, setWaterGlasses] = useState<number>(0);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [completionPercent, setCompletionPercent] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  
  // Get the list for the current phase
  const phaseList = groceryListsByPhase[currentPhase];
  
  // Initialize or load saved grocery list from localStorage
  useEffect(() => {
    const savedList = localStorage.getItem(`groceryList-${currentPhase}`);
    if (savedList) {
      setGroceryList(JSON.parse(savedList));
    } else {
      // Initialize with unchecked items
      setGroceryList(phaseList.items.map(item => ({...item, isChecked: false})));
    }
  }, [currentPhase]);
  
  // Update completion percentage
  useEffect(() => {
    if (groceryList.length > 0) {
      const checkedItems = groceryList.filter(item => item.isChecked).length;
      const newPercent = Math.round((checkedItems / groceryList.length) * 100);
      setCompletionPercent(newPercent);
      
      // Check if list is complete
      if (newPercent === 100 && !showMessage) {
        setShowMessage(true);
        audioService.play('bonus');
        toast({
          title: "Amazing! Shopping list complete!",
          description: `You've defeated ${phaseList.enemies.join(" and ")}!`,
          duration: 6000,
        });
        // Reward streak completion
        updateStreak();
      }
    }
  }, [groceryList]);
  
  const handleFoodSelect = (food: string) => {
    audioService.play('click');
    setFoodSelected(food);
    setStep('hydration');
  };
  
  const handleWaterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setWaterGlasses(value);
  };
  
  const handleSubmitHydration = () => {
    audioService.play('click');
    if (waterGlasses < 6) {
      toast({
        title: "Remember to stay hydrated!",
        description: "Try to drink at least 6 glasses of water daily for hormonal health.",
        duration: 4000,
      });
    } else {
      toast({
        title: "Great hydration!",
        description: "Staying hydrated helps balance hormones.",
        duration: 3000,
      });
    }
    setStep('grocery');
  };
  
  const toggleItem = (itemId: string) => {
    audioService.play('click');
    const updatedList = groceryList.map(item => 
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );
    setGroceryList(updatedList);
    
    // Save to localStorage
    localStorage.setItem(`groceryList-${currentPhase}`, JSON.stringify(updatedList));
  };
  
  const handleShopOnline = () => {
    window.open('https://www.instacart.com', '_blank');
  };
  
  const resetInteraction = () => {
    setStep('food');
    setFoodSelected(null);
    setWaterGlasses(0);
    setShowMessage(false);
  };
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md">
      {step === 'food' && (
        <>
          <h3 className="text-center font-semibold mb-4">What have you eaten today?</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleFoodSelect('carbs')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <span className="text-xl mb-2">🍞</span>
              <span>Carbs (bread, pasta)</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleFoodSelect('vegetables')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <span className="text-xl mb-2">🥗</span>
              <span>Vegetables/fruit</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleFoodSelect('protein')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <span className="text-xl mb-2">🍗</span>
              <span>Protein (meat, fish, eggs)</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleFoodSelect('sweets')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <span className="text-xl mb-2">🍪</span>
              <span>Sweets/junk food</span>
            </Button>
          </div>
        </>
      )}
      
      {step === 'hydration' && (
        <>
          <h3 className="text-center font-semibold mb-4">How many glasses of water have you drunk? (250ml/glass)</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <input
              type="number"
              min="0"
              max="20"
              value={waterGlasses}
              onChange={handleWaterInput}
              className="p-2 border border-gray-300 rounded w-16 text-center"
            />
            <span>glasses</span>
          </div>
          <div className="flex justify-center">
            <Button onClick={handleSubmitHydration}>Next</Button>
          </div>
        </>
      )}
      
      {step === 'grocery' && (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              {currentPhase === "menstruation" ? "🩸 Menstrual Phase Groceries" :
               currentPhase === "follicular" ? "🌱 Follicular Phase Groceries" :
               currentPhase === "ovulatory" ? "🥚 Ovulatory Phase Groceries" :
               "🍂 Luteal Phase Groceries"}
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={resetInteraction}>
                Reset
              </Button>
              <Button size="sm" onClick={handleShopOnline}>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Shop Online
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-1">{phaseList.goal}</div>
          
          <div className="mb-3">
            <Progress value={completionPercent} className="h-2" />
            <div className="text-xs text-right mt-1">
              {completionPercent}% complete
            </div>
          </div>
          
          <Card className="p-0">
            <ScrollArea className="h-[40vh] p-3">
              <div className="space-y-2">
                {groceryList.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Checkbox 
                      id={`check-${item.id}`} 
                      checked={item.isChecked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="data-[state=checked]:animate-pulse"
                    />
                    <div className="flex justify-between w-full">
                      <label 
                        htmlFor={`check-${item.id}`} 
                        className={`text-sm cursor-pointer ${item.isChecked ? 'line-through text-gray-400' : ''}`}
                      >
                        {item.name}
                      </label>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          
          <div className="text-xs text-center mt-3 text-gray-500">
            Buying these items will help defeat: {phaseList.enemies.join(" & ")}
          </div>
        </>
      )}
    </div>
  );
}
