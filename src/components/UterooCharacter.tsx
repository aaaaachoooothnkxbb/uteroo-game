
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseToImage = {
  menstruation: "/lovable-uploads/9ceb35ec-281c-4e4f-bad4-279fd2c1aedf.png",
  follicular: "/lovable-uploads/9ceb35ec-281c-4e4f-bad4-279fd2c1aedf.png",
  ovulatory: "/lovable-uploads/9ceb35ec-281c-4e4f-bad4-279fd2c1aedf.png",
  luteal: "/lovable-uploads/9ceb35ec-281c-4e4f-bad4-279fd2c1aedf.png"
};

// Lab coat version for lab room
const phaseToLabImage = {
  menstruation: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png",
  follicular: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png",
  ovulatory: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png",
  luteal: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png"
};

const phaseToEmoji = {
  menstruation: "🌸",
  follicular: "🌱",
  ovulatory: "☀️",
  luteal: "🍂"
};

const phaseToMessage = {
  menstruation: "Gentle movement reduces cramps!",
  follicular: "Great time for new projects!",
  ovulatory: "Peak energy - socialize & connect!",
  luteal: "Focus on self-care & rest"
};

interface UterooCharacterProps {
  phase: Phase;
  currentRoom?: string;
  size?: "small" | "medium" | "large";
  minimal?: boolean;
  onClick?: () => void;
}

// Interface for floating hearts
interface FloatingHeart {
  id: string;
  x: number;
  y: number;
  opacity: number;
}

export const UterooCharacter = ({ 
  phase, 
  currentRoom = "", 
  size = "medium", 
  minimal = false,
  onClick
}: UterooCharacterProps) => {
  // Use lab coat image if in lab room
  const isLabRoom = currentRoom === "lab";
  const characterImage = isLabRoom ? phaseToLabImage[phase] : phaseToImage[phase];
  
  // Size classes based on the size prop - made larger as requested
  const sizeClasses = {
    small: "w-36 h-36",
    medium: "w-44 h-44",
    large: "w-52 h-52 sm:w-64 sm:h-64"
  };
  
  // State for automatic floating hearts
  const [autoHearts, setAutoHearts] = useState<FloatingHeart[]>([]);
  
  // Removed the auto-generated floating hearts effect
  // The useEffect that was creating automatic hearts has been removed
  
  // Handle click on character
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  if (minimal) {
    // Minimal version without message bubble - just the character
    return (
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <img 
            src={characterImage} 
            alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
            className={cn(
              sizeClasses[size],
              "object-contain drop-shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
            )}
            onClick={handleClick}
          />
          
          {/* Auto-generated floating hearts - now disabled */}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img 
          src={characterImage} 
          alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
          className={cn(
            sizeClasses[size],
            "object-contain drop-shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
          )}
          onClick={handleClick}
        />
        
        {/* Auto-generated floating hearts - now disabled */}
      </div>
      
      <div className={cn(
        "mt-4 font-medium tracking-wide text-white drop-shadow-md bg-gradient-to-r rounded-full backdrop-blur-sm border border-white/30 px-3 py-1.5",
        size === "small" ? "text-xs max-w-[150px]" : "text-sm max-w-[200px]",
        phase === "menstruation" ? "from-pink-500 to-pink-400" :
        phase === "follicular" ? "from-green-500 to-green-400" :
        phase === "ovulatory" ? "from-yellow-500 to-yellow-400" :
        "from-orange-500 to-orange-400"
      )}>
        <div className="flex items-center gap-1">
          <span>{phaseToEmoji[phase]}</span>
          <span className="truncate">{phaseToMessage[phase]}</span>
        </div>
      </div>
    </div>
  );
};
