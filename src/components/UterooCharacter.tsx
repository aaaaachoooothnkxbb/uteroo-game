
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { audioService } from "@/utils/audioService";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseToImage = {
  menstruation: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  follicular: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  ovulatory: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  luteal: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png"
};

// Lab coat version for lab room
const phaseToLabImage = {
  menstruation: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  follicular: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  ovulatory: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  luteal: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png"
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
  
  // Handle click on character with sound
  const handleClick = () => {
    // Play click sound
    audioService.play('heart');
    
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
        "mt-4 font-medium tracking-wide text-white drop-shadow-md bg-gradient-to-r rounded-full backdrop-blur-sm border border-white/30 px-4 py-2",
        size === "small" ? "text-sm min-w-[180px]" : "text-base min-w-[220px]",
        phase === "menstruation" ? "from-pink-500 to-pink-400" :
        phase === "follicular" ? "from-green-500 to-green-400" :
        phase === "ovulatory" ? "from-yellow-500 to-yellow-400" :
        "from-orange-500 to-orange-400"
      )}>
        <div className="flex items-center gap-2 justify-center whitespace-normal">
          <span>{phaseToEmoji[phase]}</span>
          <span>{phaseToMessage[phase]}</span>
        </div>
      </div>
    </div>
  );
};
