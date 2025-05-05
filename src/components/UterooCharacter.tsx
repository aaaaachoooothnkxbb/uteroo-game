
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseToImage = {
  menstruation: "/lovable-uploads/9d28d953-e381-4269-b89d-233823bd9f24.png", // Using the provided image
  follicular: "/lovable-uploads/9d28d953-e381-4269-b89d-233823bd9f24.png", // Using the provided image for now
  ovulatory: "/lovable-uploads/9d28d953-e381-4269-b89d-233823bd9f24.png", // Using the provided image for now
  luteal: "/lovable-uploads/9d28d953-e381-4269-b89d-233823bd9f24.png" // Using the provided image for now
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

export const UterooCharacter = ({ phase }: { phase: Phase }) => {
  return (
    <div className="flex flex-col items-center space-y-2 mt-4 z-10">
      <Card className={cn(
        "p-3 rounded-full w-fit shadow-lg bg-gradient-radial border-2 border-pink-200", 
        phaseToGradient[phase]
      )}>
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <img 
            src={phaseToImage[phase]} 
            alt={`Uteroo in ${phase} phase`} 
            className="w-full h-full object-contain animate-bounce-slow drop-shadow-lg"
          />
        </div>
      </Card>
      <p className="text-center text-xs sm:text-sm font-medium tracking-wide text-white drop-shadow-lg bg-pink-400/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
        {phaseToMessage[phase]}
      </p>
    </div>
  );
};
