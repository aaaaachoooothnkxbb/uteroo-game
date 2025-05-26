import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { audioService } from "@/utils/audioService";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

interface Enemy {
  id: string;
  name: string;
  hp: number;
  icon: string;
  suggestion: string;
}

const phaseToImage = {
  menstruation: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  follicular: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  ovulatory: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  luteal: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png"
};

// Lab coat version for lab room
const phaseToLabImage = {
  menstruation: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  follicular: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  ovulatory: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  luteal: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png"
};

// Sad and happy Uteroo images based on enemy presence
const sadUterooImage = "/lovable-uploads/0a06c37e-fc17-41fc-be9c-2417fa48a098.png";
const happyUterooImage = "/lovable-uploads/96d40a02-d93f-4503-9a3c-79200f501381.png";

const phaseToEmoji = {
  menstruation: "🌸",
  follicular: "🌱",
  ovulatory: "☀️",
  luteal: "🍂"
};

const phaseToMessage = {
  menstruation: "Gentle movement reduces cramps!",
  follicular: "Great time for new projects!",
  ovulatory: "Peak energy - socialize & connect!",
  luteal: "Focus on self-care & rest"
};

// Updated Phase to sound mapping for character interactions - using gentler sounds
const phaseToSound = {
  menstruation: "soft_bells",
  follicular: "calm_loop", // Changed from "gentle_waves" to "calm_loop" which is softer
  ovulatory: "nature_sounds",
  luteal: "calm_loop"
};

interface UterooCharacterProps {
  phase: Phase;
  currentRoom?: string;
  size?: "small" | "medium" | "large";
  minimal?: boolean;
  onClick?: () => void;
  enemies?: Enemy[];
}

// Interface for floating hearts
interface FloatingHeart {
  id: string;
  x: number;
  y: number;
  opacity: number;
}

// Interface for circling enemies
interface CirclingEnemy {
  id: string;
  angle: number;
  distance: number;
  speed: number;
  icon: string;
  name: string;
}

export const UterooCharacter = ({ 
  phase, 
  currentRoom = "", 
  size = "medium", 
  minimal = false,
  onClick,
  enemies = []
}: UterooCharacterProps) => {
  // Determine which image to use based on enemy presence
  const hasEnemies = enemies.length > 0;
  const isLabRoom = currentRoom === "lab";
  
  let characterImage;
  if (isLabRoom) {
    characterImage = phaseToLabImage[phase];
  } else if (hasEnemies) {
    characterImage = sadUterooImage;
  } else {
    characterImage = happyUterooImage;
  }
  
  // Size classes based on the size prop - made larger as requested
  const sizeClasses = {
    small: "w-40 h-40",
    medium: "w-52 h-52",
    large: "w-64 h-64 sm:w-72 sm:h-72"
  };
  
  // State for automatic floating hearts
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [currentMessage, setCurrentMessage] = useState(phaseToMessage[phase]);
  const [circlingEnemies, setCirclingEnemies] = useState<CirclingEnemy[]>([]);
  
  // Initialize circling enemies when enemies prop changes
  useEffect(() => {
    if (enemies.length > 0) {
      const newCirclingEnemies = enemies.map((enemy, index) => ({
        id: enemy.id,
        angle: (index * (360 / enemies.length)) * (Math.PI / 180), // Convert to radians
        distance: 80 + Math.random() * 20, // Base distance with some variation
        speed: 0.01 + Math.random() * 0.005, // Different speeds for each enemy
        icon: enemy.icon,
        name: enemy.name
      }));
      setCirclingEnemies(newCirclingEnemies);
    } else {
      setCirclingEnemies([]);
    }
  }, [enemies]);
  
  // Animate circling enemies
  useEffect(() => {
    if (circlingEnemies.length === 0) return;
    
    const animationInterval = setInterval(() => {
      setCirclingEnemies(prev => 
        prev.map(enemy => ({
          ...enemy,
          angle: enemy.angle + enemy.speed,
          // Pulsing distance effect - enemies get closer and further
          distance: 80 + 20 * Math.sin(enemy.angle * 2) + Math.random() * 10
        }))
      );
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, [circlingEnemies.length]);
  
  // Play room-specific sound when character changes rooms
  useEffect(() => {
    if (currentRoom) {
      audioService.playRoomSound(currentRoom);
    }
  }, [currentRoom]);
  
  // Update message when phase changes
  useEffect(() => {
    setCurrentMessage(phaseToMessage[phase]);
    
    // Play gentler sound for phase transition
    audioService.play(phaseToSound[phase]);
  }, [phase]);
  
  // Handle click on character with sound
  const handleClick = useCallback(() => {
    // Play a much gentler, calming sound
    audioService.play('gentle_waves');
    
    // Add a random variation to make the interaction more pleasant
    if (Math.random() > 0.7) {
      // Occasionally play an additional soft sound for variety
      audioService.play('soft_bells');
    }
    
    // Create a new floating heart
    const newHeart: FloatingHeart = {
      id: `heart-${Date.now()}-${Math.random()}`,
      x: Math.random() * 40 - 20, // Random offset for x position
      y: -20 - Math.random() * 30, // Start position above character
      opacity: 1
    };
    
    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Remove the heart after animation completes
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
    }, 1500);
    
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  if (minimal) {
    // Minimal version without message bubble - just the character
    return (
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <img 
            src={characterImage} 
            alt={`Uteroo ${hasEnemies ? 'sad with enemies' : 'happy without enemies'}${isLabRoom ? ' with lab coat' : ''}`} 
            className={cn(
              sizeClasses[size],
              "object-contain drop-shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
            )}
            onClick={handleClick}
          />
          
          {/* Floating hearts animation */}
          {floatingHearts.map(heart => (
            <div
              key={heart.id}
              className="absolute pointer-events-none"
              style={{
                transform: `translate(${heart.x}px, ${heart.y}px)`,
                animation: 'float-up 1.5s ease-out forwards'
              }}
            >
              <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Circling enemies */}
        {circlingEnemies.map(enemy => {
          const x = Math.cos(enemy.angle) * enemy.distance;
          const y = Math.sin(enemy.angle) * enemy.distance;
          
          return (
            <div
              key={enemy.id}
              className="absolute pointer-events-none z-10"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                left: '50%',
                top: '50%',
                marginLeft: '-16px', // Half of enemy size (32px)
                marginTop: '-16px'
              }}
            >
              <div className="relative">
                <img 
                  src={enemy.icon} 
                  alt={enemy.name}
                  className="w-8 h-8 object-contain drop-shadow-lg animate-pulse"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.3))'
                  }}
                />
                {/* Menacing glow effect */}
                <div className="absolute inset-0 w-8 h-8 bg-red-500 opacity-20 rounded-full animate-ping" />
              </div>
            </div>
          );
        })}
        
        <img 
          src={characterImage} 
          alt={`Uteroo ${hasEnemies ? 'sad with enemies' : 'happy without enemies'}${isLabRoom ? ' with lab coat' : ''}`} 
          className={cn(
            sizeClasses[size],
            "object-contain drop-shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
          )}
          onClick={handleClick}
        />
        
        {/* Floating hearts animation */}
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute pointer-events-none"
            style={{
              transform: `translate(${heart.x}px, ${heart.y}px)`,
              animation: 'float-up 1.5s ease-out forwards'
            }}
          >
            <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
          </div>
        ))}
      </div>
      
      <div className={cn(
        "mt-4 font-medium tracking-wide text-white drop-shadow-md bg-transparent backdrop-blur-sm border border-white/30 rounded-full px-4 py-2",
        size === "small" ? "text-sm min-w-[180px]" : "text-base min-w-[220px]"
      )}>
        <div className="flex items-center gap-2 justify-center whitespace-normal">
          <span>{phaseToEmoji[phase]}</span>
          <span>{currentMessage}</span>
        </div>
      </div>
    </div>
  );
};
