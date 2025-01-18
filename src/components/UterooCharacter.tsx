import { Card } from "@/components/ui/card";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseToImage = {
  menstruation: "/lovable-uploads/f8d4352b-6e9e-4bdd-a16f-b4479bb5101e.png",
  follicular: "/lovable-uploads/1f84dc45-8a8e-4c3f-b172-d1e790401cab.png",
  ovulatory: "/lovable-uploads/0e918b43-4f92-4624-bdac-ada61f161501.png",
  luteal: "/lovable-uploads/b876a90f-d862-42c0-8e10-ed06ccf862d3.png"
};

const phaseToMessage = {
  menstruation: "Time to stay active and hydrated!",
  follicular: "Let's celebrate your energy!",
  ovulatory: "Take time to relax and recharge",
  luteal: "Comfort and self-care are key"
};

export const UterooCharacter = ({ phase }: { phase: Phase }) => {
  return (
    <div className="flex flex-col items-center space-y-6">
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