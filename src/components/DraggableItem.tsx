
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DraggableItemProps {
  id: string;
  type: "hunger" | "hygiene" | "energy" | "happiness";
  icon: string;
  boost?: number;
  onDrop: (type: string) => void;
}

export const DraggableItem = ({ id, type, icon, boost = 10, onDrop }: DraggableItemProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("itemType", type);
    e.dataTransfer.setData("boost", boost.toString());
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
        src="/lovable-uploads/dd07ef54-174b-4c57-aa81-9593562fb75f.png"
        alt={`${type} boost item`}
        className="w-full h-full object-contain pixelated"
      />
    </div>
  );
};

