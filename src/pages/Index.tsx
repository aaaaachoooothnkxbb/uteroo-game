
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Gamepad, ShoppingBag, Dumbbell, 
  Heart, Settings, HelpCircle 
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      icon: Gamepad, 
      label: "Uteroo Game", 
      path: "/pou-game",
      className: "bg-purple-600 hover:bg-purple-700"
    },
    { 
      icon: Dumbbell, 
      label: "Fitness", 
      path: "/yoga",
      className: "bg-green-600 hover:bg-green-700"
    },
    { 
      icon: ShoppingBag, 
      label: "Recipes", 
      path: "/recipe",
      className: "bg-orange-600 hover:bg-orange-700"
    },
    { 
      icon: Heart, 
      label: "Profile", 
      path: "/profile",
      className: "bg-pink-600 hover:bg-pink-700"
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/settings",
      className: "bg-gray-600 hover:bg-gray-700"
    },
    { 
      icon: HelpCircle, 
      label: "Rewards", 
      path: "/rewards",
      className: "bg-blue-600 hover:bg-blue-700"
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('lovable-uploads/288447a2-40bf-47aa-80cf-825af00bed16.png')] bg-cover bg-center animate-float"
        style={{
          imageRendering: 'pixelated',
          backgroundSize: 'cover'
        }}
      />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="grid grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`h-24 w-full flex flex-col items-center justify-center text-white ${item.className}`}
            >
              <item.icon className="h-8 w-8 mb-2" />
              <span className="text-xs font-semibold">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
