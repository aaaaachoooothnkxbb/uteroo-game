
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarOptions {
  animal: string;
  color: string;
  accessory: string;
}

interface AvatarCreationProps {
  onAvatarCreate: (avatar: AvatarOptions) => void;
}

const animals = [
  { id: "fox", name: "Fox", emoji: "🦊" },
  { id: "bear", name: "Bear", emoji: "🐻" },
  { id: "cat", name: "Cat", emoji: "🐱" },
  { id: "owl", name: "Owl", emoji: "🦉" },
  { id: "rabbit", name: "Rabbit", emoji: "🐰" },
];

const colors = [
  { id: "pink", name: "Pink", class: "bg-pink-400" },
  { id: "purple", name: "Purple", class: "bg-purple-400" },
  { id: "blue", name: "Blue", class: "bg-blue-400" },
  { id: "green", name: "Green", class: "bg-green-400" },
  { id: "orange", name: "Orange", class: "bg-orange-400" },
];

const accessories = [
  { id: "none", name: "None", emoji: "" },
  { id: "hat", name: "Hat", emoji: "🎩" },
  { id: "glasses", name: "Glasses", emoji: "👓" },
  { id: "bow", name: "Bow", emoji: "🎀" },
  { id: "flower", name: "Flower", emoji: "🌸" },
];

export const AvatarCreation = ({ onAvatarCreate }: AvatarCreationProps) => {
  const [selectedAnimal, setSelectedAnimal] = useState(animals[0].id);
  const [selectedColor, setSelectedColor] = useState(colors[0].id);
  const [selectedAccessory, setSelectedAccessory] = useState(accessories[0].id);

  const handleCreate = () => {
    onAvatarCreate({
      animal: selectedAnimal,
      color: selectedColor,
      accessory: selectedAccessory,
    });
  };

  const getSelectedAnimal = () => animals.find(a => a.id === selectedAnimal);
  const getSelectedAccessory = () => accessories.find(a => a.id === selectedAccessory);

  return (
    <div className="space-y-6">
      {/* Avatar Preview */}
      <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Your Avatar Preview</h3>
          <div className="relative inline-block">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-4xl",
              colors.find(c => c.id === selectedColor)?.class
            )}>
              {getSelectedAnimal()?.emoji}
            </div>
            {getSelectedAccessory()?.emoji && (
              <div className="absolute -top-2 -right-2 text-2xl">
                {getSelectedAccessory()?.emoji}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Animal Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">Choose Your Animal Companion</h3>
        <div className="grid grid-cols-5 gap-2">
          {animals.map((animal) => (
            <Button
              key={animal.id}
              variant={selectedAnimal === animal.id ? "default" : "outline"}
              className="h-16 flex flex-col items-center gap-1"
              onClick={() => setSelectedAnimal(animal.id)}
            >
              <span className="text-xl">{animal.emoji}</span>
              <span className="text-xs">{animal.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">Choose Color</h3>
        <div className="flex gap-2">
          {colors.map((color) => (
            <Button
              key={color.id}
              variant={selectedColor === color.id ? "default" : "outline"}
              className="w-12 h-12 p-0"
              onClick={() => setSelectedColor(color.id)}
            >
              <div className={cn("w-8 h-8 rounded-full", color.class)} />
            </Button>
          ))}
        </div>
      </div>

      {/* Accessory Selection */}
      <div className="space-y-3">
        <h3 className="font-medium">Choose Accessory (Optional)</h3>
        <div className="grid grid-cols-5 gap-2">
          {accessories.map((accessory) => (
            <Button
              key={accessory.id}
              variant={selectedAccessory === accessory.id ? "default" : "outline"}
              className="h-16 flex flex-col items-center gap-1"
              onClick={() => setSelectedAccessory(accessory.id)}
            >
              <span className="text-xl">{accessory.emoji || "✨"}</span>
              <span className="text-xs">{accessory.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleCreate}
        className="w-full bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full py-3 text-lg font-medium"
      >
        Uteroo, Let's Adventure! 🌟
      </Button>
    </div>
  );
};
