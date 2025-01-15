import { Card } from "@/components/ui/card";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseToImage = {
  menstruation: "/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png",
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
    <Card className="p-4 w-fit mx-auto mb-6">
      <div className="flex flex-col items-center space-y-4">
        <img 
          src={phaseToImage[phase]} 
          alt={`Uteroo in ${phase} phase`} 
          className="w-40 h-40 object-contain animate-bounce-slow"
        />
        <p className="text-center text-sm font-medium text-gray-600">
          {phaseToMessage[phase]}
        </p>
      </div>
    </Card>
  );
};