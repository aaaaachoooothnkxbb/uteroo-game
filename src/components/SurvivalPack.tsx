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
    { id: "comfort_control", name: "Comfort Control", emoji: "🩸", effectiveness: { cramps: 3, fatigue: 1 } },
    { id: "heat_hugger", name: "Heating Pad", emoji: "🔥", effectiveness: { cramps: 5, fatigue: 2 } },
    { id: "green_power", name: "Spinach", emoji: "🥬", effectiveness: { fatigue: 4, cramps: 2 } },
    { id: "mood_magic", name: "Dark Chocolate", emoji: "🍫", effectiveness: { irritability: 4, sadness: 3 } },
    { id: "soothing_sips", name: "Ginger Tea", emoji: "🍵", effectiveness: { cramps: 3, anxiety: 2 } },
    { id: "cozy_cover", name: "Soft Blanket", emoji: "🛌", effectiveness: { cramps: 2, sadness: 3 } },
    { id: "inner_peace", name: "Calming Book", emoji: "📖", effectiveness: { anxiety: 4, irritability: 3 } }
  ],
  follicular: [
    { id: "estrogen_support", name: "Broccoli", emoji: "🥦", effectiveness: { fatigue: 3, anxiety: 2 } },
    { id: "seed_power", name: "Flax Seeds", emoji: "🌱", effectiveness: { fatigue: 4, irritability: 2 } },
    { id: "berry_burst", name: "Blueberries", emoji: "🫐", effectiveness: { fatigue: 3, migraine: 2 } },
    { id: "lean_fuel", name: "Eggs", emoji: "🥚", effectiveness: { fatigue: 5, anxiety: 1 } },
    { id: "steady_carbs", name: "Oats", emoji: "🍚", effectiveness: { fatigue: 4, anxiety: 3 } },
    { id: "hydration_hero", name: "Water Bottle", emoji: "💧", effectiveness: { migraine: 4, fatigue: 2 } },
    { id: "mind_spark", name: "Pen and Paper", emoji: "📝", effectiveness: { anxiety: 3, irritability: 2 } }
  ],
  ovulatory: [
    { id: "healthy_fats", name: "Avocado", emoji: "🥑", effectiveness: { sensitivity: 3, migraine: 2 } },
    { id: "omega_power", name: "Salmon", emoji: "🐟", effectiveness: { sensitivity: 4, migraine: 3 } },
    { id: "fertility_fuel", name: "Almonds", emoji: "🌰", effectiveness: { sensitivity: 3, migraine: 4 } },
    { id: "bright_veggies", name: "Bell Peppers", emoji: "🥕", effectiveness: { sensitivity: 2, migraine: 2 } },
    { id: "connection_catalyst", name: "Phone", emoji: "📞", effectiveness: { sensitivity: 5, migraine: 1 } },
    { id: "energy_boost", name: "Workout Shoes", emoji: "👟", effectiveness: { sensitivity: 2, migraine: 3 } },
    { id: "radiant_glow", name: "Face Mask", emoji: "🧖‍♀️", effectiveness: { sensitivity: 4, migraine: 2 } }
  ],
  luteal: [
    { id: "progesterone_pal", name: "Pumpkin Seeds", emoji: "🌻", effectiveness: { irritability: 4, sadness: 3 } },
    { id: "calm_sips", name: "Chamomile Tea", emoji: "🌼", effectiveness: { irritability: 5, anxiety: 4 } },
    { id: "magnesium_master", name: "Epsom Salts", emoji: "🛀", effectiveness: { irritability: 3, cramps: 4 } },
    { id: "fiber_friend", name: "Apples", emoji: "🍎", effectiveness: { irritability: 2, sadness: 2 } },
    { id: "comfort_food", name: "Sweet Potatoes", emoji: "🍠", effectiveness: { sadness: 4, irritability: 2 } },
    { id: "mood_soother", name: "Essential Oil", emoji: "🌿", effectiveness: { sadness: 5, irritability: 4 } },
    { id: "zen_zone", name: "Headphones", emoji: "🎧", effectiveness: { sadness: 3, irritability: 5 } }
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
  const [flyingEmojis, setFlyingEmojis] = useState<Array<{id: string; emoji: string; x: number; y: number}>>([]);
  
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

  // Get which enemy the item is most effective against
  const getTargetEnemy = (item: any) => {
    if (!enemies.length) return "";
    
    let maxEffectiveness = 0;
    let targetEnemy = "";
    enemies.forEach(enemy => {
      const effectiveness = item.effectiveness[enemy.id] || 0;
      if (effectiveness > maxEffectiveness) {
        maxEffectiveness = effectiveness;
        targetEnemy = enemy.name;
      }
    });
    
    return targetEnemy;
  };

  // Handle item click to release emoji
  const handleItemClick = (item: any, index: number, event: React.MouseEvent) => {
    if (hasActiveEnemies) {
      const rect = event.currentTarget.getBoundingClientRect();
      const newFlyingEmoji = {
        id: `${item.id}-${Date.now()}`,
        emoji: item.emoji,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      setFlyingEmojis(prev => [...prev, newFlyingEmoji]);
      
      // Remove the flying emoji after animation
      setTimeout(() => {
        setFlyingEmojis(prev => prev.filter(e => e.id !== newFlyingEmoji.id));
      }, 3000);
    } else {
      toggleItem(index);
    }
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

  // Handle emoji drag start
  const handleEmojiDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({
      item: item,
      effectiveness: getItemEffectiveness(item)
    }));
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(item.id);
  };

  const handleEmojiDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="relative">
      {/* Flying Emojis */}
      {flyingEmojis.map(flyingEmoji => (
        <div
          key={flyingEmoji.id}
          className="fixed pointer-events-none z-30 text-2xl animate-bounce cursor-grab"
          style={{
            left: flyingEmoji.x,
            top: flyingEmoji.y,
            transform: 'translate(-50%, -50%)'
          }}
          draggable
          onDragStart={(e) => {
            const item = currentItems.find(item => item.emoji === flyingEmoji.emoji);
            if (item) handleEmojiDragStart(e, item);
          }}
          onDragEnd={handleEmojiDragEnd}
        >
          {flyingEmoji.emoji}
        </div>
      ))}

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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggle}
                className="h-6 w-6 p-0 ml-auto"
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
                  💪 Click items to release emojis, then drag emojis to fight the {enemies.map(e => e.name).join(", ")} monster{enemies.length > 1 ? 's' : ''}!
                </p>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentItems.map((item, index) => {
                const effectiveness = getItemEffectiveness(item);
                const isHighlighted = effectiveness > 0;
                const targetEnemy = getTargetEnemy(item);
                
                return (
                  <div 
                    key={`${normalizedPhase}-${index}`}
                    onClick={(e) => handleItemClick(item, index, e)}
                    className={cn(
                      "flex items-start space-x-2 p-2 rounded transition-all cursor-pointer",
                      hasActiveEnemies ? "hover:bg-yellow-50" : "hover:bg-gray-50",
                      isHighlighted && hasActiveEnemies ? "bg-yellow-50 border-2 border-yellow-300 shadow-md animate-pulse-glow" : ""
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
                        {item.emoji} {item.name}{targetEnemy && ` -> ${targetEnemy}`}
                      </span>
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
