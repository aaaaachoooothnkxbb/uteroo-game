
import { cn } from "@/lib/utils";

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
}

export const UterooCharacter = ({ 
  phase, 
  currentRoom = "", 
  size = "medium",
  minimal = false 
}: UterooCharacterProps) => {
  // Use lab coat image if in lab room
  const isLabRoom = currentRoom === "lab";
  const characterImage = isLabRoom ? phaseToLabImage[phase] : phaseToImage[phase];
  
  // Size classes based on the size prop
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-24 h-24",
    large: "w-28 h-28 sm:w-32 sm:h-32"
  };
  
  if (minimal) {
    // Minimal version without message bubble - just the character
    return (
      <img 
        src={characterImage} 
        alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
        className={cn(
          sizeClasses[size],
          "object-contain drop-shadow-md"
        )}
      />
    );
  }
  
  return (
    <div className="flex items-center">
      <img 
        src={characterImage} 
        alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
        className={cn(
          sizeClasses[size],
          "object-contain drop-shadow-md"
        )}
      />
      <div className={cn(
        "ml-2 font-medium tracking-wide text-white drop-shadow-md bg-gradient-to-r rounded-full backdrop-blur-sm border border-white/30 px-3 py-1.5",
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
