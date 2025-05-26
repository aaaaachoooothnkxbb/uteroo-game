
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Heart } from "lucide-react";

interface CompanionNamingProps {
  onComplete: (companionName: string) => void;
}

export const CompanionNaming = ({ onComplete }: CompanionNamingProps) => {
  const [companionName, setCompanionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!companionName.trim()) {
      toast({
        title: "Please enter a name",
        description: "Your companion needs a special name!",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save the companion name to the user's profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          companion_name: companionName.trim()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving companion name:', error);
        toast({
          title: "Error saving name",
          description: "Please try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Uteroo!",
          description: `Meet ${companionName}, your new companion!`,
        });
        onComplete(companionName.trim());
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected error",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm border shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
              alt="Your Uteroo Companion"
              className="w-32 h-32 object-contain animate-bounce"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#9370DB]">
              Meet Your Companion!
            </h1>
            <p className="text-gray-600">
              This is your personal Uteroo companion who will be with you throughout your hormonal journey. 
              What would you like to name them?
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[#FF69B4] font-bold">
            <Heart fill="#FF69B4" size={20} />
            <span>+10 for naming your companion!</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="companionName" className="text-sm font-medium text-gray-700">
              Companion Name
            </label>
            <Input
              id="companionName"
              type="text"
              placeholder="Enter a special name..."
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              maxLength={20}
              className="text-center text-lg font-medium"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            <p className="text-xs text-gray-500 text-center">
              Choose something meaningful to you!
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !companionName.trim()}
            className="w-full bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full py-3 text-lg font-medium"
          >
            {isLoading ? "Saving..." : `Welcome ${companionName || "___"}!`}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            You can always change this name later in your profile settings
          </p>
        </div>
      </Card>
    </div>
  );
};
