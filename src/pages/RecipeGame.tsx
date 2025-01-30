import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft, ArrowRight, HelpCircle, ShoppingBag, Refrigerator } from "lucide-react";
import { RecipeRoulette } from "@/components/RecipeRoulette";

const RecipeGame = () => {
  const navigate = useNavigate();
  const [showRecipeRoulette, setShowRecipeRoulette] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDE1D3] flex flex-col">
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
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="px-4 py-1 bg-white rounded-md shadow-sm">
              <span className="text-lg font-bold">Cocina</span>
            </div>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Character Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="w-48 h-48 bg-[#D4A27C] rounded-full flex items-center justify-center">
          <div className="w-32 h-16 bg-[#8B4513] rounded-[50%] flex items-center justify-center">
            <div className="flex gap-8">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-full" />
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default RecipeGame;