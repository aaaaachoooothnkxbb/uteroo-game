
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PreQuestionnaireProps {
  onComplete: (username: string) => void;
}

export const PreQuestionnaire = ({ onComplete }: PreQuestionnaireProps) => {
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!username.trim()) {
      toast({
        title: "Please enter a username",
        description: "Choose a username to continue",
        variant: "destructive",
      });
      return;
    }

    console.log('PreQuestionnaire submitting:', username);
    onComplete(username.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm border shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
              alt="Uteroo Welcome"
              className="w-24 h-24 object-contain animate-bounce"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#9370DB]">
              Welcome to Uteroo!
            </h1>
            <p className="text-gray-600">
              Let's start by choosing a username for your journey
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="text-center text-lg font-medium"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="w-full bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full py-3 text-lg font-medium"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
