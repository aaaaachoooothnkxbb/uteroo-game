
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoinsIcon, Heart, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardPopupProps {
  isVisible: boolean;
  xp: number;
  coins: number;
  hearts?: number;
  isVictory?: boolean;
  monsterName?: string;
  onClose: () => void;
}

export const RewardPopup = ({
  isVisible,
  xp,
  coins,
  hearts = 0,
  isVictory = false,
  monsterName = "",
  onClose
}: RewardPopupProps) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setAnimationStage(0);
      
      // Stage 1: Show popup
      setTimeout(() => setAnimationStage(1), 100);
      
      // Stage 2: Show XP animation
      setTimeout(() => setAnimationStage(2), 500);
      
      // Stage 3: Show coins animation
      setTimeout(() => setAnimationStage(3), 1000);
      
      // Stage 4: Show hearts animation (if any)
      if (hearts > 0) {
        setTimeout(() => setAnimationStage(4), 1500);
      }
      
      // Auto close after 4 seconds
      setTimeout(() => {
        onClose();
        setAnimationStage(0);
      }, 4000);
    }
  }, [isVisible, hearts, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className={cn(
        "p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-4 max-w-sm w-full mx-4 text-center transition-all duration-500",
        animationStage >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0",
        isVictory ? "border-yellow-400" : "border-green-400"
      )}>
        {/* Victory header */}
        {isVictory && (
          <div className="mb-4">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-yellow-600 mb-1">
              CHAMPION VICTORY!
            </h2>
            <p className="text-sm text-gray-600">
              You defeated the {monsterName}!
            </p>
          </div>
        )}

        {/* Regular reward header */}
        {!isVictory && (
          <div className="mb-4">
            <div className="text-3xl mb-2">⚡</div>
            <h2 className="text-lg font-bold text-green-600 mb-1">
              Great Job, Champion!
            </h2>
            <p className="text-sm text-gray-600">
              You helped Uteroo feel better!
            </p>
          </div>
        )}

        {/* Rewards */}
        <div className="space-y-3 mb-4">
          {/* XP Reward */}
          <div className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-500",
            animationStage >= 2 ? "bg-blue-50 scale-100 opacity-100" : "scale-75 opacity-0"
          )}>
            <Trophy className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-blue-700">+{xp} XP</span>
          </div>

          {/* Coins Reward */}
          <div className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-500",
            animationStage >= 3 ? "bg-yellow-50 scale-100 opacity-100" : "scale-75 opacity-0"
          )}>
            <CoinsIcon className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold text-yellow-700">+{coins} Coins</span>
          </div>

          {/* Hearts Reward */}
          {hearts > 0 && (
            <div className={cn(
              "flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-500",
              animationStage >= 4 ? "bg-pink-50 scale-100 opacity-100" : "scale-75 opacity-0"
            )}>
              <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
              <span className="font-semibold text-pink-700">+{hearts} Hearts</span>
            </div>
          )}
        </div>

        {/* Close button */}
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          Continue
        </Button>
      </Card>
    </div>
  );
};
