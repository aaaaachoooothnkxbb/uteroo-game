
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DraggableItemProps {
  id: string;
  type: "hunger" | "hygiene" | "energy" | "happiness";
  icon: string;
  boost?: number;
  onDrop: (type: string) => void;
  onClick?: () => void;
}

export const DraggableItem = ({ id, type, icon, boost = 10, onDrop, onClick }: DraggableItemProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("itemType", type);
    e.dataTransfer.setData("boost", boost.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={cn(
        "w-16 h-16 cursor-move transition-all duration-300",
        isDragging ? "opacity-50 scale-95" : "hover:scale-110",
        onClick && "cursor-pointer"
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
