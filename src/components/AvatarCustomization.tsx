
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AvatarCustomizationProps {
  onComplete: () => void;
}

export const AvatarCustomization = ({ onComplete }: AvatarCustomizationProps) => {
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedAccessory, setSelectedAccessory] = useState<string>("");

  const animals = ["Cat", "Dog", "Rabbit", "Fox", "Bear"];
  const colors = ["Brown", "Black", "White", "Gray", "Orange"];
  const accessories = ["None", "Bow", "Hat", "Glasses", "Scarf"];

  const progress = 90; // Near completion

  const handleComplete = () => {
    // Save avatar customization (would typically save to database)
    console.log("Avatar customized:", { selectedAnimal, selectedColor, selectedAccessory });
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">Almost done!</p>
          </div>
          <CardTitle className="text-2xl font-bold">
            🎨 Customize Your Avatar
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Choose your animal:</h3>
            <div className="grid grid-cols-5 gap-2">
              {animals.map((animal) => (
                <Button
                  key={animal}
                  variant={selectedAnimal === animal ? "default" : "outline"}
                  onClick={() => setSelectedAnimal(animal)}
                  className="h-auto p-2"
                >
                  {animal}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Choose your color:</h3>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  onClick={() => setSelectedColor(color)}
                  className="h-auto p-2"
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Choose an accessory:</h3>
            <div className="grid grid-cols-5 gap-2">
              {accessories.map((accessory) => (
                <Button
                  key={accessory}
                  variant={selectedAccessory === accessory ? "default" : "outline"}
                  onClick={() => setSelectedAccessory(accessory)}
                  className="h-auto p-2"
                >
                  {accessory}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={!selectedAnimal || !selectedColor || !selectedAccessory}
            className="w-full mt-6"
          >
            Complete Setup 🎉
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
