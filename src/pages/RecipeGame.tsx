
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  ShoppingBag, 
  Refrigerator,
  Heart,
  Droplet,
  BatteryFull,
  Apple
} from "lucide-react";
import { RecipeRoulette } from "@/components/RecipeRoulette";
import { UterooCharacter } from "@/components/UterooCharacter";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";

const rooms = ["Bedroom", "Bathroom", "Kitchen", "Game Room"];

const RecipeGame = () => {
  const navigate = useNavigate();
  const [showRecipeRoulette, setShowRecipeRoulette] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(2); // Start with Kitchen
  const [showTutorial, setShowTutorial] = useState(false);

  const handlePreviousRoom = () => {
    setCurrentRoomIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  const handleNextRoom = () => {
    setCurrentRoomIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  // Tutorial video for recipe game
  const tutorialVideo = {
    src: "https://player.vimeo.com/external/517177560.sd.mp4?s=ccc7ecc16eaef12b89a8856fa6e5455c893c371b&profile_id=164&oauth2_token_id=57447761",
    title: "How to Play Recipe Game",
    description: "Learn how to use the Recipe Roulette, cook meals, and gain points."
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-white/90 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">200</span>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="w-8 h-8">
              <Camera className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-8 h-8"
              onClick={handlePreviousRoom}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="px-4 py-1 bg-white rounded-md shadow-sm">
              <span className="text-lg font-bold animate-fade-in">
                {rooms[currentRoomIndex]}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-8 h-8"
              onClick={handleNextRoom}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-8 h-8"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Character Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Status Indicators */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 p-4 rounded-lg shadow-md w-80">
          <div className="grid grid-cols-2 gap-4">
            {/* Hunger */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Hunger</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            {/* Hygiene */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Hygiene</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            {/* Energy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BatteryFull className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Energy</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            {/* Happiness */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Happiness</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </div>

        <UterooCharacter phase="menstruation" />
      </div>

      {/* Bottom Bar */}
      <div className="bg-white/90 p-4">
        <div className="flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-xs">Back</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1"
            onClick={() => setShowRecipeRoulette(true)}
          >
            <Refrigerator className="w-6 h-6" />
            <span className="text-xs">Recipe</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs">Shop</span>
          </Button>
        </div>
      </div>

      {/* Recipe Roulette Dialog */}
      {showRecipeRoulette && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <RecipeRoulette phase="menstruation" />
            <div className="p-4 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => setShowRecipeRoulette(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Video Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Recipe Game Tutorial</DialogTitle>
          <VideoPlayer
            src={tutorialVideo.src}
            title={tutorialVideo.title}
            description={tutorialVideo.description}
            controls={true}
            autoPlay={true}
          />
          <div className="flex justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close Tutorial</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeGame;
