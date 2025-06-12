
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurvivalPackProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPhase?: string;
  hasActiveEnemies?: boolean;
  hasDailyGoals?: boolean;
  enemies?: Array<{ id: string; name: string; hp: number; icon: string; suggestion: string; }>;
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
  currentPhase = "menstruation",
  hasActiveEnemies = false,
  hasDailyGoals = false,
  enemies = []
}: SurvivalPackProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);
  
  // Enhanced debugging
  console.log("🎒 SurvivalPack - Raw currentPhase prop:", currentPhase);
  console.log("🎒 SurvivalPack - Type of currentPhase:", typeof currentPhase);
  
  // Normalize the phase key - handle different cases and formats
  let normalizedPhase = currentPhase?.toLowerCase()?.trim() || "menstruation";
  
  // Handle potential phase name variations
  const phaseMapping: { [key: string]: string } = {
    "menstruation": "menstruation",
    "menstrual": "menstruation",
    "period": "menstruation",
    "follicular": "follicular",
    "ovulatory": "ovulatory",
    "ovulation": "ovulatory",
    "luteal": "luteal"
  };
  
  if (phaseMapping[normalizedPhase]) {
    normalizedPhase = phaseMapping[normalizedPhase];
  }
  
  console.log("🎒 SurvivalPack - Normalized phase:", normalizedPhase);
  
  const phaseKey = normalizedPhase as keyof typeof survivalItems;
  const currentItems = survivalItems[phaseKey] || survivalItems.menstruation;
  const currentMessage = phaseMessages[phaseKey] || phaseMessages.menstruation;
  
  console.log("🎒 SurvivalPack - Final phaseKey:", phaseKey);
  console.log("🎒 SurvivalPack - Items count:", currentItems.length);
  console.log("🎒 SurvivalPack - First item:", currentItems[0]);
  
  const toggleItem = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  // Reset checked items when phase changes
  useEffect(() => {
    console.log("🎒 Phase changed, resetting checked items");
    setCheckedItems(new Set());
  }, [currentPhase]);

  // Show thought bubble when enemies are active
  useEffect(() => {
    if (hasActiveEnemies && enemies.length > 0) {
      setShowThoughtBubble(true);
    } else {
      setShowThoughtBubble(false);
    }
  }, [hasActiveEnemies, enemies]);

  // Determine if backpack should have visual cue
  const shouldShowVisualCue = hasActiveEnemies || hasDailyGoals;

  // Get the first enemy name for the call-to-action message
  const firstEnemyName = enemies.length > 0 ? enemies[0].name : "";

  const handleThoughtBubbleClick = () => {
    setShowThoughtBubble(false);
  };

  return (
    <div className="relative">
      {/* Call-to-Action Bubble - positioned to come from Uteroo's location */}
      {showThoughtBubble && hasActiveEnemies && enemies.length > 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-32 z-20">
          <div 
            className="bg-white/95 backdrop-blur-sm border-2 border-pink-300 rounded-2xl px-3 py-2 shadow-lg max-w-48 animate-pulse-glow cursor-pointer"
            onClick={handleThoughtBubbleClick}
          >
            <div className="text-xs font-semibold text-gray-800 text-center leading-tight">
              💭 Uteroo needs help! {firstEnemyName} is here! Tap the backpack!
            </div>
            {/* Speech bubble tail pointing towards Uteroo */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-pink-300"></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-2px] w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* Backpack Icon */}
      <div 
        onClick={onToggle} 
        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 flex flex-col items-center"
      >
        <div className={cn(
          "text-4xl",
          hasActiveEnemies ? "animate-pulse-glow" : "animate-pulse-slow"
        )}>
          🎒
        </div>
        <span className="text-xs font-semibold text-white bg-black/50 rounded-full px-2 py-0.5 mt-1">
          Survival Pack
        </span>
      </div>

      {/* Backpack Modal/Dropdown */}
      {isOpen && (
        <div className="absolute top-0 left-0 z-50">
          <Card className="w-80 p-4 bg-white/95 backdrop-blur-sm shadow-lg border-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">🎒 Survival Pack - {normalizedPhase}</h3>
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
                  key={`${normalizedPhase}-${index}`}
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

export default SurvivalPack;
