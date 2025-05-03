
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface DraggableItemProps {
  id: string;
  type: "hunger" | "hygiene" | "energy" | "happiness";
  icon: string;
  boost?: number;
  onDrop: (type: string) => void;
  onClick?: () => void;
  meditationPlaylist?: boolean;
  journalingItem?: boolean;
  tooltip?: {
    title?: string;
    description: string;
    learnMoreUrl?: string;
  };
}

export const DraggableItem = ({ 
  id, 
  type, 
  icon, 
  boost = 10, 
  onDrop, 
  onClick,
  meditationPlaylist,
  journalingItem,
  tooltip
}: DraggableItemProps) => {
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
    if (meditationPlaylist) {
      e.preventDefault();
      e.stopPropagation();
      window.open('https://open.spotify.com/album/1LWRSOuPZO4XA8H9tetvMe', '_blank');
      return;
    }
    
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  const renderTooltip = () => {
    if (!tooltip) return null;

    return (
      <div className="absolute top-0 right-0 z-10">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button className="rounded-full bg-white/80 p-0.5 shadow-sm hover:bg-white">
                <HelpCircle className="h-3 w-3 text-primary" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="max-w-[200px] p-3 bg-white/95 backdrop-blur-sm text-left"
            >
              {tooltip.title && (
                <h4 className="font-semibold mb-1 text-xs">{tooltip.title}</h4>
              )}
              <p className="text-xs">{tooltip.description}</p>
              {tooltip.learnMoreUrl && (
                <a 
                  href={tooltip.learnMoreUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs mt-2 text-primary block hover:underline"
                >
                  Saber más
                </a>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 cursor-move transition-all duration-300 relative",
        isDragging ? "opacity-50 scale-95" : "hover:scale-110",
        (onClick || meditationPlaylist || journalingItem) && "cursor-pointer"
      )}
    >
      <img
        src={icon}
        alt={`${type} boost item`}
        className={cn(
          "w-full h-full object-contain pixelated filter drop-shadow-md", 
          (onClick || meditationPlaylist || journalingItem) && "cursor-pointer"
        )}
      />
      {renderTooltip()}
    </div>
  );
};
