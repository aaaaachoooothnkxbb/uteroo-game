
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
  
  // Handle auto-generated floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      // Create a new heart with random position
      const newHeart: FloatingHeart = {
        id: `auto-${Date.now()}-${Math.random()}`,
        x: Math.random() * 40 - 20, // Random offset -20 to +20px
        y: 0, // Start position at the center of character
        opacity: 1,
      };
      
      setAutoHearts(prev => [...prev, newHeart]);
      
      // Remove the heart after animation completes
      setTimeout(() => {
        setAutoHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
      }, 2000);
    }, 2000); // Every 2 seconds
    
    return () => clearInterval(interval);
  }, []);
  
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
          
          {/* Auto-generated floating hearts */}
          {autoHearts.map(heart => (
            <div
              key={heart.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                transform: `translate(calc(-50% + ${heart.x}px), calc(-50% + ${heart.y}px))`,
                animation: 'float-up 2s ease-out forwards'
              }}
            >
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                <span className="text-xs font-bold text-white bg-pink-500 rounded-full px-1 ml-0.5">+1</span>
              </div>
            </div>
          ))}
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
        
        {/* Auto-generated floating hearts - positioned from center of Uteroo */}
        {autoHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${heart.x}px), calc(-50% + ${heart.y}px))`,
              animation: 'float-up 2s ease-out forwards'
            }}
          >
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              <span className="text-xs font-bold text-white bg-pink-500 rounded-full px-1 ml-0.5">+1</span>
            </div>
          </div>
        ))}
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

