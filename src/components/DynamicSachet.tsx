
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Heart, Brain, Zap } from "lucide-react";
import { SachetItem, SachetCategory } from "@/types/sachet";
import { useToast } from "@/hooks/use-toast";

interface DynamicSachetProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase?: string;
  currentSymptoms?: string[];
}

export const DynamicSachet = ({ isOpen, onClose, currentPhase = "follicular", currentSymptoms = [] }: DynamicSachetProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("symptom-slayer");
  const { toast } = useToast();

  const categories: SachetCategory[] = [
    {
      id: "symptom-slayer",
      name: "Symptom Slayers",
      description: "Combat specific symptoms with targeted wellness tools",
      color: "bg-red-100 border-red-300",
      items: [
        {
          id: "magnesium-bites",
          name: "Magnesium Miracle Bites",
          description: "Powerful ally against the Cramp Crawler",
          category: "symptom-slayer",
          icon: "✨",
          isAvailable: true,
          effectText: "Reduces muscle tension and cramping",
          phases: ["menstruation", "luteal"]
        },
        {
          id: "ginger-warriors",
          name: "Ginger Warriors",
          description: "Defeat the Nausea Ninja with spicy power",
          category: "symptom-slayer",
          icon: "🔥",
          isAvailable: true,
          effectText: "Soothes digestive discomfort",
          phases: ["menstruation"]
        },
        {
          id: "chamomile-calm",
          name: "Chamomile Calm Drops",
          description: "Send the Anxiety Goblin packing",
          category: "symptom-slayer",
          icon: "🌼",
          isAvailable: true,
          effectText: "Promotes relaxation and reduces stress",
          phases: ["luteal"]
        }
      ]
    },
    {
      id: "phase-power-up",
      name: "Phase Power-Ups",
      description: "Amplify your cycle phase superpowers",
      color: "bg-purple-100 border-purple-300",
      items: [
        {
          id: "estrogen-glow",
          name: "Estrogen Glow Greens",
          description: "Enhance your follicular phase radiance",
          category: "phase-power-up",
          icon: "🌱",
          isAvailable: true,
          effectText: "Supports energy and skin health",
          phases: ["follicular"]
        },
        {
          id: "ovulation-vitality",
          name: "Ovulation Vitality Boost",
          description: "Maximize your peak power phase",
          category: "phase-power-up",
          icon: "⚡",
          isAvailable: true,
          effectText: "Enhances confidence and energy",
          phases: ["ovulatory"]
        },
        {
          id: "progesterone-peace",
          name: "Progesterone Peace Pod",
          description: "Find your luteal phase sanctuary",
          category: "phase-power-up",
          icon: "🕯️",
          isAvailable: true,
          effectText: "Promotes calm and restful sleep",
          phases: ["luteal"]
        }
      ]
    },
    {
      id: "general-wellness",
      name: "General Wellness",
      description: "Daily essentials for consistent self-care",
      color: "bg-green-100 border-green-300",
      items: [
        {
          id: "journaling-quill",
          name: "Daily Journaling Quill",
          description: "Reflect and process your journey",
          category: "general-wellness",
          icon: "📝",
          isAvailable: true,
          effectText: "Enhances mindfulness and self-awareness"
        },
        {
          id: "affirmation-gem",
          name: "Affirmation Playlist Gem",
          description: "Fill your day with positive energy",
          category: "general-wellness",
          icon: "💎",
          isAvailable: true,
          effectText: "Boosts confidence and mood"
        },
        {
          id: "reading-bookmark",
          name: "Reading Time Bookmark",
          description: "Escape into knowledge and stories",
          category: "general-wellness",
          icon: "📚",
          isAvailable: true,
          effectText: "Reduces stress and expands mind"
        }
      ]
    }
  ];

  const activeItems = categories.find(cat => cat.id === activeCategory)?.items || [];
  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  // Highlight items relevant to current phase
  const getHighlightedItems = (items: SachetItem[]) => {
    return items.map(item => ({
      ...item,
      isHighlighted: item.phases?.includes(currentPhase) || false
    }));
  };

  const handleUseItem = (item: SachetItem) => {
    toast({
      title: `${item.name} activated! ✨`,
      description: item.effectText,
    });
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "symptom-slayer": return <Zap className="w-4 h-4" />;
      case "phase-power-up": return <Sparkles className="w-4 h-4" />;
      case "general-wellness": return <Heart className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎒</div>
            <div>
              <h2 className="text-xl font-bold text-purple-600">Uteroo's Wellness Sachet</h2>
              <p className="text-sm text-gray-600">Your pocket of power-ups</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex h-96">
          {/* Category Sidebar */}
          <div className="w-1/3 border-r bg-gray-50 p-4 space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-purple-100 border-purple-300 border-2"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getCategoryIcon(category.id)}
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <p className="text-xs text-gray-600">{category.description}</p>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-800">
                {activeCategoryData?.name}
              </h3>
              <p className="text-sm text-gray-600">{activeCategoryData?.description}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {getHighlightedItems(activeItems).map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 transition-all cursor-pointer hover:shadow-md ${
                    item.isHighlighted
                      ? "ring-2 ring-purple-400 bg-purple-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => handleUseItem(item)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        {item.isHighlighted && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      {item.effectText && (
                        <p className="text-xs text-purple-600 italic">{item.effectText}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
