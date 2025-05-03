
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseToImage = {
  menstruation: "/lovable-uploads/bb75ffbb-199c-4115-9ab1-fd2935d8440a.png",
  follicular: "/lovable-uploads/bb75ffbb-199c-4115-9ab1-fd2935d8440a.png",
  ovulatory: "/lovable-uploads/bb75ffbb-199c-4115-9ab1-fd2935d8440a.png",
  luteal: "/lovable-uploads/bb75ffbb-199c-4115-9ab1-fd2935d8440a.png"
};

const phaseToMessage = {
  menstruation: "Time to stay active and hydrated!",
  follicular: "Let's celebrate your energy!",
  ovulatory: "Take time to relax and recharge",
  luteal: "Comfort and self-care are key"
};

const phaseToGradient = {
  menstruation: "from-menstruation-light/40 to-transparent",
  follicular: "from-follicular-light/40 to-transparent",
  ovulatory: "from-ovulatory-light/40 to-transparent",
  luteal: "from-luteal-light/40 to-transparent"
};

export const UterooCharacter = ({ phase }: { phase: Phase }) => {
  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <Card className={cn(
        "p-2 rounded-full w-fit shadow-lg bg-gradient-radial", 
        phaseToGradient[phase]
      )}>
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center">
          <img 
            src={phaseToImage[phase]} 
            alt={`Uteroo in ${phase} phase`} 
            className="w-full h-full object-contain animate-bounce-slow drop-shadow-lg"
          />
        </div>
      </Card>
      <p className="text-center text-xs sm:text-sm font-medium tracking-wide text-white drop-shadow-lg bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
        {phaseToMessage[phase]}
      </p>
    </div>
  );
};
