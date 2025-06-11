
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurvivalPackProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPhase?: string;
}

const survivalItems = {
  menstruation: [
    "🩸 Comfort Control: Pads, Tampons, or Menstrual Cup",
    "🔥 Heat Hugger: Heating Pad or Hot Water Bottle",
    "🥬 Green Power: Spinach or Kale",
    "🍫 Mood Magic: Dark Chocolate (70%+)",
    "🍵 Soothing Sips: Ginger, Peppermint, or Green Tea Bags",
    "🛌 Cozy Cover: A Soft Blanket or Fuzzy Socks",
    "📖 Inner Peace: Your favorite calming Book or Journal"
  ],
  follicular: [
    "🥦 Estrogen Support: Broccoli or Brussels Sprouts",
    "🌱 Seed Power: Flax Seeds or Pumpkin Seeds",
    "🫐 Berry Burst: Blueberries or Raspberries",
    "🥚 Lean Fuel: Eggs or Chicken Breast",
    "🍚 Steady Carbs: Oats or Quinoa",
    "💧 Hydration Hero: A Reusable Water Bottle",
    "📝 Mind Spark: Pen and Paper for new ideas"
  ],
  ovulatory: [
    "🥑 Healthy Fats: Avocado",
    "🐟 Omega Power: Canned Salmon or Sardines",
    "🌰 Fertility Fuel: Nuts (Almonds, Walnuts)",
    "🥕 Bright Veggies: Bell Peppers or Carrots",
    "📞 Connection Catalyst: Your Phone (to call a friend!)",
    "👟 Energy Boost: Your favorite Workout Shoes",
    "🧖‍♀️ Radiant Glow: A Face Mask or Sheet Mask"
  ],
  luteal: [
    "🌻 Progesterone Pal: Pumpkin Seeds or Sunflower Seeds",
    "🌼 Calm Sips: Chamomile Tea Bags",
    "🛀 Magnesium Master: Epsom Salts (for a bath)",
    "🍎 Fiber Friend: Apples or Pears",
    "🍠 Comfort Food: Sweet Potatoes or Brown Rice",
    "🌿 Mood Soother: Essential Oil Diffuser or Calming Spray",
    "🎧 Zen Zone: Noise-Canceling Headphones or Earplugs"
  ]
};

const phaseMessages = {
  menstruation: "Time for rest and renewal, Champion! Here's what Uteroo needs to feel cozy and strong this phase:",
  follicular: "Time to rise and shine, Champion! Uteroo's energy is building. Here's what we need for growth and vitality:",
  ovulatory: "You're at your peak, Champion! Uteroo is radiating power. Here's what we need to shine and connect:",
  luteal: "Time to nurture and prepare, Champion! Uteroo needs calm and grounding. Here's your cozy Luteal collection:"
};

export const SurvivalPack = ({
  isOpen,
  onToggle,
  currentPhase = "menstruation"
}: SurvivalPackProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  
  const currentItems = survivalItems[currentPhase as keyof typeof survivalItems] || survivalItems.menstruation;
  const currentMessage = phaseMessages[currentPhase as keyof typeof phaseMessages] || phaseMessages.menstruation;
  
  const toggleItem = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  return (
    <div className="relative">
      {/* Backpack Icon */}
      <div 
        onClick={onToggle} 
        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 flex flex-col items-center"
      >
        <div className="text-4xl animate-pulse-slow">🎒</div>
        <span className="text-xs font-semibold text-white bg-black/50 rounded-full px-2 py-0.5 mt-1">
          Survival Pack
        </span>
      </div>

      {/* Backpack Modal/Dropdown */}
      {isOpen && (
        <div className="absolute top-0 left-0 z-50">
          <Card className="w-80 p-4 bg-white/95 backdrop-blur-sm shadow-lg border-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">🎒 Survival Pack</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggle}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {currentMessage}
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentItems.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => toggleItem(index)}
                  className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div 
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors mt-0.5 flex-shrink-0",
                      checkedItems.has(index) 
                        ? "bg-green-500 border-green-500" 
                        : "border-gray-300"
                    )}
                  >
                    {checkedItems.has(index) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-xs flex-1 leading-relaxed",
                      checkedItems.has(index) 
                        ? "line-through text-gray-500" 
                        : "text-gray-700"
                    )}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t">
              <div className="text-xs text-center text-gray-500">
                {checkedItems.size}/{currentItems.length} items collected
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
