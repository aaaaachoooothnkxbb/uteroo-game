import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onExperiencedClick: () => void;
  onNewUserClick: () => void;
}

export const WelcomeStep = ({ onExperiencedClick, onNewUserClick }: WelcomeStepProps) => {
  return (
    <div className="space-y-6 text-center">
      <img
        src="/lovable-uploads/b299e826-f68d-4a0a-b4ae-295d9a500bed.png"
        alt="Welcome"
        className="w-32 h-32 mx-auto"
      />
      <h2 className="text-2xl font-bold text-[#FF69B4]">Welcome to Uteroo!</h2>
      <p className="text-gray-700">Let's get to know each other better...</p>
      <div className="space-y-4">
        <Button
          onClick={onExperiencedClick}
          className="w-full bg-[#FF69B4] hover:bg-[#FF1493] text-white"
        >
          I know my cycle
        </Button>
        <Button
          onClick={onNewUserClick}
          className="w-full bg-[#9370DB] hover:bg-[#8A2BE2] text-white"
        >
          I'm new to this...
        </Button>
      </div>
    </div>
  );
};