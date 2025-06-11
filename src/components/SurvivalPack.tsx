
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
    "Comfort Control (Pads, Tampons, Cup): Your preferred period product",
    "Heat Hugger (Heating Pad): A heating pad or hot water bottle for soothing cramps",
    "Green Power (Spinach/Leafy Greens): A bag of fresh spinach or other leafy greens for iron and magnesium",
    "Mood Magic (Dark Chocolate 70%+): A bar of dark chocolate (70%+ cacao) for mood and magnesium",
    "Soothing Sips (Ginger, Peppermint, Green Tea): Ginger tea, peppermint tea, or calming green tea bags",
    "Leakage Shield (Black Undies): Comfortable black undies – your reliable ally against leaks!",
    "Inner Strength (Bravery): And don't forget to pack your Bravery – Uteroo knows you're strong enough for anything!"
  ],
  follicular: [
    "Cruciferous Crusader (Broccoli/Kale): Broccoli or kale for healthy estrogen metabolism",
    "Seed Power (Flax/Pumpkin Seeds): Flax seeds or pumpkin seeds for hormone support and fiber",
    "Vibrant Vitamin C (Citrus Fruits): Oranges, grapefruit, or bell peppers for Vitamin C",
    "Lean Protein Pouch (Chicken/Lentils): Lean protein source like chicken breast or lentils for sustained energy",
    "Whole Grain Grounding (Oats/Quinoa): Oats or quinoa for steady energy and B vitamins",
    "Movement Motivation (New Workout Gear/Journal): Something that motivates you to move – a new pair of socks, or a workout journal!",
    "Spark of Creativity (Journal/Sketchbook): Your personal spark of creativity – a journal or sketchbook to capture ideas!"
  ],
  ovulatory: [
    "Avocado Ace (Avocado): A ripe avocado for healthy fats and hormone support",
    "Omega-3 Ocean Delight (Wild Salmon/Sardines): Wild salmon or sardines for essential Omega-3s",
    "Zinc Zinger (Eggs/Nuts): Eggs or a handful of nuts for zinc and fertility support",
    "Hydration Hero (Reusable Water Bottle): A reusable water bottle to stay super hydrated during your peak energy",
    "Social Sparkler (Small Gift/Card): A small gift or card for someone you care about, to ignite connection!",
    "Confidence Catalyst (Your Favorite Outfit): Your favorite outfit that makes you feel amazing and confident!",
    "Positive Vibe (Your Best Smile): And don't forget to pack your best smile – it's contagious!"
  ],
  luteal: [
    "Progesterone Pal (Pumpkin Seeds): Pumpkin seeds for magnesium and zinc, crucial for progesterone",
    "Calm Companion (Chamomile/Passionflower Tea): Chamomile or Passionflower tea for soothing relaxation",
    "Stress Soother (Magnesium Supplement/Epsom Salt): Magnesium supplement or Epsom salts for calming muscles and nerves",
    "Fiber Friend (Berries/Apples): Berries or apples for fiber to support healthy digestion",
    "Comfort Companion (Cozy Blanket/Socks): A super cozy blanket or pair of socks for ultimate comfort",
    "Mood Harmonizer (Journal/Calming Playlist): A journal or a link to a calming playlist to soothe your soul",
    "Self-Compassion Compass (Patience): And pack your Self-Compassion Compass – remember to be extra kind to yourself!"
  ]
};

export const SurvivalPack = ({
  isOpen,
  onToggle,
  currentPhase = "menstruation"
}: SurvivalPackProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  
  const currentItems = survivalItems[currentPhase as keyof typeof survivalItems] || survivalItems.menstruation;
  
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
              <div className="text-sm font-medium text-gray-700 mb-2">What are we working with???...</div>
              <p className="text-xs text-gray-500 mb-3">
                Check off the survival items you have for this level:
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
