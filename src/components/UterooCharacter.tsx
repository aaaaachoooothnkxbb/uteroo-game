import { Card } from "@/components/ui/card";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const phaseToImage = {
  menstruation: "/lovable-uploads/019acee7-e13b-4e26-9b63-ca8ddfd4e238.png",
  follicular: "/lovable-uploads/019acee7-e13b-4e26-9b63-ca8ddfd4e238.png",
  ovulatory: "/lovable-uploads/019acee7-e13b-4e26-9b63-ca8ddfd4e238.png",
  luteal: "/lovable-uploads/019acee7-e13b-4e26-9b63-ca8ddfd4e238.png"
};

const phaseToMessage = {
  menstruation: "Time to stay active and hydrated!",
  follicular: "Let's celebrate your energy!",
  ovulatory: "Take time to relax and recharge",
  luteal: "Comfort and self-care are key"
};

export const UterooCharacter = ({ phase }: { phase: Phase }) => {
  return (
    <div className="flex flex-col items-center space-y-6 mt-8">
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