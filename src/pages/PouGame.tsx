import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Apple,
  Bath,
  Bed,
  Gamepad,
  ShoppingBag,
  Heart,
  Droplet,
  BatteryFull,
  Home
} from "lucide-react";
import { UterooCharacter } from "@/components/UterooCharacter";

const rooms = ["Living Room", "Kitchen", "Bathroom", "Bedroom", "Game Room", "Shop"];

const PouGame = () => {
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState("Living Room");
  const [stats, setStats] = useState({
    hunger: 75,
    hygiene: 90,
    energy: 60,
    happiness: 85,
    coins: 200
  });

  const getRoomIcon = (room: string) => {
    switch (room) {
      case "Living Room":
        return <Home className="w-6 h-6" />;
      case "Kitchen":
        return <Apple className="w-6 h-6" />;
      case "Bathroom":
        return <Bath className="w-6 h-6" />;
      case "Bedroom":
        return <Bed className="w-6 h-6" />;
      case "Game Room":
        return <Gamepad className="w-6 h-6" />;
      case "Shop":
        return <ShoppingBag className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Top Bar - Stats */}
      <div className="bg-white/90 p-4 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{stats.coins}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 flex-1 max-w-xs mx-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Apple className="w-4 h-4 text-orange-500" />
              </div>
              <Progress value={stats.hunger} className="h-1" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Droplet className="w-4 h-4 text-blue-500" />
              </div>
              <Progress value={stats.hygiene} className="h-1" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <BatteryFull className="w-4 h-4 text-green-500" />
              </div>
              <Progress value={stats.energy} className="h-1" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              <Progress value={stats.happiness} className="h-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Character Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-[60vh]">
        <div className="absolute inset-0 flex items-center justify-center">
          <UterooCharacter phase="menstruation" />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/90 p-4 shadow-md">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-2">
          {rooms.map((room) => (
            <Button
              key={room}
              variant={currentRoom === room ? "default" : "ghost"}
              className="flex flex-col items-center gap-1 p-2"
              onClick={() => setCurrentRoom(room)}
            >
              {getRoomIcon(room)}
              <span className="text-xs">{room}</span>
            </Button>
          ))}
        </div>
        <div className="max-w-md mx-auto mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PouGame;