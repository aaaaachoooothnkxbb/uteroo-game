import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HormoneInfoProps {
  onContinue: () => void;
}

export const HormoneInfo = ({ onContinue }: HormoneInfoProps) => {
  return (
    <div className="min-h-screen bg-[#FF69B4] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white/90 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <img
            src="/lovable-uploads/4393595c-c2c4-4bf4-9e35-92258d623741.png"
            alt="Hormones"
            className="w-32 h-32 mx-auto"
          />
          <h2 className="text-2xl font-bold text-[#FF69B4]">Understanding Your Hormones</h2>
          <p className="text-gray-700 leading-relaxed">
            Your hormones, including Estrogen, Progesterone, Luteinizing hormone (LH), and Follicle-stimulating hormone (FSH), play a crucial role in your cycle. They influence your mood, energy, and overall well-being.
          </p>
          <Button
            onClick={onContinue}
            className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8"
          >
            Got it!
          </Button>
        </div>
      </Card>
    </div>
  );
};