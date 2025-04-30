
import { Card } from "@/components/ui/card";

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

export const UterooCharacter = ({ phase }: { phase: Phase }) => {
  return (
    <div className="flex flex-col items-center space-y-6 mt-20">
      <Card className="p-5 rounded-full w-fit bg-transparent border-none shadow-none">
        <div className="w-56 h-56 rounded-full overflow-hidden flex items-center justify-center">
          <img 
            src={phaseToImage[phase]} 
            alt={`Uteroo in ${phase} phase`} 
            className="w-full h-full object-contain animate-bounce-slow"
          />
        </div>
      </Card>
      <p className="text-center text-lg font-semibold tracking-wide text-white drop-shadow-md">
        {phaseToMessage[phase]}
      </p>
    </div>
  );
};
