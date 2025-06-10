
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Coffee, Gamepad2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UterooCharacter } from "@/components/UterooCharacter";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const PouGame = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPhase] = useState<Phase>("follicular");
  const [happiness, setHappiness] = useState(75);
  const [energy, setEnergy] = useState(60);
  const [companionName, setCompanionName] = useState("Your Companion");

  // Fetch companion name
  useEffect(() => {
    const fetchCompanionName = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('companion_name')
          .eq('id', user.id)
          .single();
          
        if (profile?.companion_name) {
          setCompanionName(profile.companion_name);
        }
      } catch (error) {
        console.error('Error fetching companion name:', error);
      }
    };
    
    fetchCompanionName();
  }, [user]);

  const feedCompanion = () => {
    setHappiness(prev => Math.min(100, prev + 10));
    setEnergy(prev => Math.min(100, prev + 5));
  };

  const playWithCompanion = () => {
    setHappiness(prev => Math.min(100, prev + 15));
    setEnergy(prev => Math.max(0, prev - 10));
  };

  const restCompanion = () => {
    setEnergy(prev => Math.min(100, prev + 20));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-[#9370DB]">
            Companion Care
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Main Character Display */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {companionName}
            </h2>
            
            {/* Show UterooCharacter with companion */}
            <div className="flex justify-center">
              <UterooCharacter 
                phase={currentPhase} 
                size="large"
                currentRoom="pou-game"
              />
            </div>
            
            {/* Stats */}
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="font-medium">Happiness: {happiness}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Energy: {energy}%</span>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex justify-center gap-2">
              {happiness > 80 && <Badge className="bg-pink-100 text-pink-800">Very Happy</Badge>}
              {energy > 80 && <Badge className="bg-green-100 text-green-800">Energetic</Badge>}
              {happiness < 30 && <Badge variant="destructive">Needs Attention</Badge>}
              {energy < 20 && <Badge className="bg-orange-100 text-orange-800">Tired</Badge>}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <Coffee className="h-8 w-8 mx-auto text-brown-500" />
              <h3 className="font-bold">Feed</h3>
              <p className="text-sm text-gray-600">
                Give your companion a healthy snack
              </p>
              <Button onClick={feedCompanion} className="w-full">
                Feed (+10 happiness, +5 energy)
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center space-y-4">
              <Gamepad2 className="h-8 w-8 mx-auto text-blue-500" />
              <h3 className="font-bold">Play</h3>
              <p className="text-sm text-gray-600">
                Play games and have fun together
              </p>
              <Button onClick={playWithCompanion} className="w-full">
                Play (+15 happiness, -10 energy)
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center space-y-4">
              <Star className="h-8 w-8 mx-auto text-purple-500" />
              <h3 className="font-bold">Rest</h3>
              <p className="text-sm text-gray-600">
                Let your companion take a peaceful nap
              </p>
              <Button onClick={restCompanion} className="w-full">
                Rest (+20 energy)
              </Button>
            </div>
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100">
          <h3 className="font-bold mb-3">Companion Care Tips</h3>
          <ul className="space-y-2 text-sm">
            <li>• Keep happiness above 50% for best results</li>
            <li>• Balance play and rest to maintain energy</li>
            <li>• Regular feeding keeps your companion healthy</li>
            <li>• Your companion's mood affects your cycle tracking experience</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default PouGame;
