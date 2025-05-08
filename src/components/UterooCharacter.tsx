
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

const phaseToGradient = {
  menstruation: "from-pink-200 to-transparent",
  follicular: "from-green-200 to-transparent",
  ovulatory: "from-yellow-200 to-transparent",
  luteal: "from-orange-200 to-transparent"
};

interface UterooCharacterProps {
  phase: Phase;
  currentRoom?: string;
}

export const UterooCharacter = ({ phase, currentRoom = "" }: UterooCharacterProps) => {
  // Use lab coat image if in lab room
  const isLabRoom = currentRoom === "lab";
  const characterImage = isLabRoom ? phaseToLabImage[phase] : phaseToImage[phase];
  
  return (
    <div className="flex flex-col items-center space-y-2 mt-4 z-10">
      {/* Removed Card and background */}
      <div className="w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
        <img 
          src={characterImage} 
          alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
          className="w-full h-full object-contain animate-bounce-slow drop-shadow-lg"
        />
      </div>
      <p className="text-center text-xs sm:text-sm font-medium tracking-wide text-white drop-shadow-lg bg-pink-400/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
        {phaseToMessage[phase]}
      </p>
    </div>
  );
};
