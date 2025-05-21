
import React from 'react';

interface RoomProps {
  id: string;
  name: string;
  image: string;
  description: string;
  onEnter?: () => void;
  isActive?: boolean;
}

export const Room: React.FC<RoomProps> = ({ 
  id,
  name,
  image,
  description,
  onEnter,
  isActive = false
}) => {
  return (
    <div 
      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all ${isActive ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onEnter}
    >
      <img src={image} alt={name} className="w-full h-32 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-white/80">{description}</p>
      </div>
    </div>
  );
};
