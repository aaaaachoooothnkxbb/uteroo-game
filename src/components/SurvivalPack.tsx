
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
    "🩸 Either pads, tampon, cup...",
    "🔥 Heating pad",
    "🥬 Spinach",
    "🍫 Dark chocolate",
    "🫖 Ginger, Peppermint, Green tea",
    "🩲 Black undies",
    "💪 Bravery"
  ],
  follicular: [
    "🥩 Protein-rich foods",
    "🍎 Fresh fruits",
    "🥬 Leafy greens",
    "⚡ Energy-boosting snacks",
    "👕 Comfortable workout clothes",
    "💧 Water bottle",
    "✨ Motivation"
  ],
  ovulatory: [
    "🥗 Light, hydrating foods",
    "🌈 Colorful vegetables",
    "🥥 Coconut water",
    "☀️ Sunscreen",
    "💎 Confidence booster",
    "🎉 Social energy",
    "✨ Radiance"
  ],
  luteal: [
    "🥜 Magnesium-rich foods",
    "🍞 Complex carbs",
    "🍵 Calming teas",
    "🧸 Cozy blanket",
    "💆‍♀️ Self-care essentials",
    "🧘‍♀️ Patience",
    "🕊️ Inner peace"
  ]
};

export const SurvivalPack = ({ isOpen, onToggle, currentPhase = "menstruation" }: SurvivalPackProps) => {
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
              <div className="text-sm font-medium text-gray-700 mb-2">
                🤖 Uteroo asks: "What are we working with?"
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Check off the survival items you have for this level:
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentItems.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => toggleItem(index)}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div 
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                      checkedItems.has(index) 
                        ? "bg-green-500 border-green-500" 
                        : "border-gray-300"
                    )}
                  >
                    {checkedItems.has(index) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm flex-1",
                    checkedItems.has(index) 
                      ? "line-through text-gray-500" 
                      : "text-gray-700"
                  )}>
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
