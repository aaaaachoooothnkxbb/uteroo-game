
import React from 'react';

export type ItemType = "food" | "hygiene" | "entertainment" | "energy" | "happiness";

interface ItemProps {
  id: string;
  name: string;
  type: ItemType;
  image: string;
  effect: number;
  cost: number;
  description: string;
  sound?: string;
  onClick?: () => void;
  onDragStart?: () => void;
}

export const Item: React.FC<ItemProps> = ({
  id,
  name,
  type,
  image,
  effect,
  cost,
  description,
  sound,
  onClick,
  onDragStart
}) => {
  return (
    <div 
      className="relative rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <img
        src={image}
        alt={name}
        className="object-cover w-full h-24"
      />
      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm p-2">
        <div className="flex justify-between">
          <span>{name}</span>
          <span>+{effect}</span>
        </div>
      </div>
    </div>
  );
};
