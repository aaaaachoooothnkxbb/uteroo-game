
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
  onItemDrag?: (item: string, effectiveness: number) => void;
}

const survivalItems = {
  menstruation: [
    { id: "comfort_control", name: "🩸 Comfort Control: Pads, Tampons, or Menstrual Cup", effectiveness: { cramps: 3, fatigue: 1 } },
    { id: "heat_hugger", name: "🔥 Heat Hugger: Heating Pad or Hot Water Bottle", effectiveness: { cramps: 5, fatigue: 2 } },
    { id: "green_power", name: "🥬 Green Power: Spinach or Kale", effectiveness: { fatigue: 4, cramps: 2 } },
    { id: "mood_magic", name: "🍫 Mood Magic: Dark Chocolate (70%+)", effectiveness: { irritability: 4, sadness: 3 } },
    { id: "soothing_sips", name: "🍵 Soothing Sips: Ginger, Peppermint, or Green Tea Bags", effectiveness: { cramps: 3, anxiety: 2 } },
    { id: "cozy_cover", name: "🛌 Cozy Cover: A Soft Blanket or Fuzzy Socks", effectiveness: { cramps: 2, sadness: 3 } },
    { id: "inner_peace", name: "📖 Inner Peace: Your favorite calming Book or Journal", effectiveness: { anxiety: 4, irritability: 3 } }
  ],
  follicular: [
    { id: "estrogen_support", name: "🥦 Estrogen Support: Broccoli or Brussels Sprouts", effectiveness: { fatigue: 3, anxiety: 2 } },
    { id: "seed_power", name: "🌱 Seed Power: Flax Seeds or Pumpkin Seeds", effectiveness: { fatigue: 4, irritability: 2 } },
    { id: "berry_burst", name: "🫐 Berry Burst: Blueberries or Raspberries", effectiveness: { fatigue: 3, migraine: 2 } },
    { id: "lean_fuel", name: "🥚 Lean Fuel: Eggs or Chicken Breast", effectiveness: { fatigue: 5, anxiety: 1 } },
    { id: "steady_carbs", name: "🍚 Steady Carbs: Oats or Quinoa", effectiveness: { fatigue: 4, anxiety: 3 } },
    { id: "hydration_hero", name: "💧 Hydration Hero: A Reusable Water Bottle", effectiveness: { migraine: 4, fatigue: 2 } },
    { id: "mind_spark", name: "📝 Mind Spark: Pen and Paper for new ideas", effectiveness: { anxiety: 3, irritability: 2 } }
  ],
  ovulatory: [
    { id: "healthy_fats", name: "🥑 Healthy Fats: Avocado", effectiveness: { sensitivity: 3, migraine: 2 } },
    { id: "omega_power", name: "🐟 Omega Power: Canned Salmon or Sardines", effectiveness: { sensitivity: 4, migraine: 3 } },
    { id: "fertility_fuel", name: "🌰 Fertility Fuel: Nuts (Almonds, Walnuts)", effectiveness: { sensitivity: 3, migraine: 4 } },
    { id: "bright_veggies", name: "🥕 Bright Veggies: Bell Peppers or Carrots", effectiveness: { sensitivity: 2, migraine: 2 } },
    { id: "connection_catalyst", name: "📞 Connection Catalyst: Your Phone (to call a friend!)", effectiveness: { sensitivity: 5, migraine: 1 } },
    { id: "energy_boost", name: "👟 Energy Boost: Your favorite Workout Shoes", effectiveness: { sensitivity: 2, migraine: 3 } },
    { id: "radiant_glow", name: "🧖‍♀️ Radiant Glow: A Face Mask or Sheet Mask", effectiveness: { sensitivity: 4, migraine: 2 } }
  ],
  luteal: [
    { id: "progesterone_pal", name: "🌻 Progesterone Pal: Pumpkin Seeds or Sunflower Seeds", effectiveness: { irritability: 4, sadness: 3 } },
    { id: "calm_sips", name: "🌼 Calm Sips: Chamomile Tea Bags", effectiveness: { irritability: 5, anxiety: 4 } },
    { id: "magnesium_master", name: "🛀 Magnesium Master: Epsom Salts (for a bath)", effectiveness: { irritability: 3, cramps: 4 } },
    { id: "fiber_friend", name: "🍎 Fiber Friend: Apples or Pears", effectiveness: { irritability: 2, sadness: 2 } },
    { id: "comfort_food", name: "🍠 Comfort Food: Sweet Potatoes or Brown Rice", effectiveness: { sadness: 4, irritability: 2 } },
    { id: "mood_soother", name: "🌿 Mood Soother: Essential Oil Diffuser or Calming Spray", effectiveness: { sadness: 5, irritability: 4 } },
    { id: "zen_zone", name: "🎧 Zen Zone: Noise-Canceling Headphones or Earplugs", effectiveness: { sadness: 3, irritability: 5 } }
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
  enemies = [],
  onItemDrag
}: SurvivalPackProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
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

  // Get effectiveness of an item against current enemies
  const getItemEffectiveness = (item: any) => {
    if (!enemies.length) return 0;
    
    let maxEffectiveness = 0;
    enemies.forEach(enemy => {
      const effectiveness = item.effectiveness[enemy.id] || 0;
      maxEffectiveness = Math.max(maxEffectiveness, effectiveness);
    });
    
    return maxEffectiveness;
  };

  // Handle item drag start
  const handleDragStart = (e: React.DragEvent, item: any, index: number) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({
      item: item,
      index: index,
      effectiveness: getItemEffectiveness(item)
    }));
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(item.id);
  };

  // Handle item drag end
  const handleDragEnd = () => {
    setDraggedItem(null);
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
              💭 Uteroo needs help! {firstEnemyName} monster is here! Tap the backpack!
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
          Survival Kit
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
              {hasActiveEnemies && enemies.length > 0 && (
                <p className="text-xs text-pink-600 font-semibold mb-2 leading-relaxed">
                  💪 Drag items to Uteroo to fight the {enemies.map(e => e.name).join(", ")} monster{enemies.length > 1 ? 's' : ''}!
                </p>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentItems.map((item, index) => {
                const effectiveness = getItemEffectiveness(item);
                const isHighlighted = effectiveness > 0;
                
                return (
                  <div 
                    key={`${normalizedPhase}-${index}`}
                    draggable={hasActiveEnemies}
                    onDragStart={(e) => handleDragStart(e, item, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => toggleItem(index)}
                    className={cn(
                      "flex items-start space-x-2 p-2 rounded transition-all cursor-pointer",
                      hasActiveEnemies ? "cursor-grab active:cursor-grabbing" : "hover:bg-gray-50",
                      isHighlighted && hasActiveEnemies ? "bg-yellow-50 border-2 border-yellow-300 shadow-md animate-pulse-glow" : "",
                      draggedItem === item.id ? "opacity-50 scale-95" : ""
                    )}
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
                    <div className="flex-1">
                      <span 
                        className={cn(
                          "text-xs flex-1 leading-relaxed block",
                          checkedItems.has(index) 
                            ? "line-through text-gray-500" 
                            : "text-gray-700"
                        )}
                      >
                        {item.name}
                      </span>
                      {isHighlighted && hasActiveEnemies && (
                        <span className="text-xs text-yellow-600 font-semibold block mt-1">
                          ⚡ Effectiveness: {effectiveness}/5
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
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
