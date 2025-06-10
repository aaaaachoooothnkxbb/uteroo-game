
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AvatarCreation } from "./AvatarCreation";

interface AvatarOptions {
  animal: string;
  color: string;
  accessory: string;
}

interface PreQuestionnaireProps {
  onComplete: (username: string, avatar: AvatarOptions) => void;
}

export const PreQuestionnaire = ({ onComplete }: PreQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<AvatarOptions | null>(null);

  const handleUsernameNext = () => {
    if (username.trim()) {
      setCurrentStep(2);
    }
  };

  const handleAvatarCreate = (avatarOptions: AvatarOptions) => {
    setAvatar(avatarOptions);
    onComplete(username, avatarOptions);
  };

  const steps = [
    // Step 0: Welcome Screen
    {
      title: "Welcome to Uteroo: Your Hormonal Health Companion!",
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
              alt="Uteroo Character"
              className="w-40 h-40 object-contain animate-bounce"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#9370DB]">
              Hi there! I'm Uteroo! 👋
            </h2>
            <p className="text-gray-700 text-lg">
              I'm your personal guide to playful self-care journeys. I'm so excited to help you understand your body and conquer any hormonal 'enemies'!
            </p>
          </div>

          <Button
            onClick={() => setCurrentStep(1)}
            className="w-full bg-[#FF69B4] hover:bg-[#FF1493] text-white rounded-full py-3 text-lg font-medium"
          >
            Let's Begin Your Journey! ✨
          </Button>
        </div>
      )
    },
    // Step 1: Username Creation
    {
      title: "Create Your Uteroo Identity",
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
              alt="Uteroo Character"
              className="w-32 h-32 object-contain"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#9370DB]">
              Let's create your unique identity! 🎯
            </h2>
            <p className="text-gray-700">
              First, what should I call you on our adventure?
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Enter your Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Your adventure name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="text-center text-lg font-medium"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUsernameNext();
                  }
                }}
              />
            </div>

            <Button
              onClick={handleUsernameNext}
              disabled={!username.trim()}
              className="w-full bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full py-3 text-lg font-medium"
            >
              Next: Design My Companion! 🎨
            </Button>
          </div>
        </div>
      )
    },
    // Step 2: Avatar Creation
    {
      title: "Design Your Uteroo Ally!",
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              <img
                src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
                alt="Uteroo Character"
                className="w-20 h-20 object-contain"
              />
              <div className="text-4xl">+</div>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-2xl">?</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#9370DB]">
                Every champion needs an ally! 🤝
              </h2>
              <p className="text-gray-700">
                Create a cute AI animal avatar to join Uteroo on your quest for wellness!
              </p>
            </div>
          </div>

          <AvatarCreation onAvatarCreate={handleAvatarCreate} />
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border shadow-lg">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-center text-[#9370DB] mb-2">
              {steps[currentStep].title}
            </h1>
            {currentStep > 0 && (
              <div className="text-center text-sm text-gray-500">
                Step {currentStep} of 2
              </div>
            )}
          </div>
          
          {steps[currentStep].content}
        </div>
      </Card>
    </div>
  );
};
