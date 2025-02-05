import { useState } from "react";
import { cn } from "@/lib/utils";

interface DraggableItemProps {
  id: string;
  type: "energy" | "happiness" | "mood";
  icon: string;
  onDrop: (type: string) => void;
}

export const DraggableItem = ({ id, type, icon, onDrop }: DraggableItemProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("itemType", type);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "w-16 h-16 cursor-move transition-all duration-300",
        isDragging ? "opacity-50 scale-95" : "hover:scale-110"
      )}
    >
      <img
        src={icon}
        alt={`${type} boost item`}
        className="w-full h-full object-contain pixelated"
      />
    </div>
  );
};