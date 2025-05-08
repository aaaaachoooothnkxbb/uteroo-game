
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

const phaseToMessage = {
  menstruation: "Time to stay active and hydrated!",
  follicular: "Let's celebrate your energy!",
  ovulatory: "Take time to relax and recharge",
  luteal: "Comfort and self-care are key"
};

interface UterooCharacterProps {
  phase: Phase;
  currentRoom?: string;
  size?: "small" | "medium" | "large";
}

export const UterooCharacter = ({ 
  phase, 
  currentRoom = "", 
  size = "medium" 
}: UterooCharacterProps) => {
  // Use lab coat image if in lab room
  const isLabRoom = currentRoom === "lab";
  const characterImage = isLabRoom ? phaseToLabImage[phase] : phaseToImage[phase];
  
  // Size classes based on the size prop
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-28 h-28 sm:w-32 sm:h-32",
    large: "w-32 h-32 sm:w-40 sm:h-40"
  };
  
  return (
    <div className="flex items-center justify-center">
      <img 
        src={characterImage} 
        alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
        className={cn(
          sizeClasses[size],
          "object-contain animate-bounce-slow drop-shadow-lg"
        )}
      />
      <p className={cn(
        "ml-3 font-medium tracking-wide text-white drop-shadow-lg bg-pink-400/80 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30",
        size === "small" ? "text-xs" : "text-sm"
      )}>
        {phaseToMessage[phase]}
      </p>
    </div>
  );
};
