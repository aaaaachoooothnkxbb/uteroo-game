
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

// Happy Uteroo image (upturned eyebrows)
const happyUterooImage = "/lovable-uploads/cc734239-4e1a-4cc6-8b9b-7b88f1c040f8.png";

// Sad Uteroo image (downturned eyebrows) 
const sadUterooImage = "/lovable-uploads/43bd93a0-8de3-466f-b05d-f7ff8b361e5b.png";

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

// Happy and sad messages
const happyMessages = {
  menstruation: "Feeling much better! 💖",
  follicular: "Energy is flowing nicely! ✨", 
  ovulatory: "Glowing with confidence! ☀️",
  luteal: "Peaceful and content! 🌙"
};

const sadMessages = {
  menstruation: "Need some care and comfort...",
  follicular: "Feeling a bit overwhelmed...",
  ovulatory: "Could use some support...",
  luteal: "Feeling heavy and tired..."
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
  onEnemiesDefeated?: () => void;
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
  hp: number;
}

export const UterooCharacter = ({ 
  phase, 
  currentRoom = "", 
  size = "medium", 
  minimal = false,
  onClick,
  enemies = [],
  onEnemiesDefeated
}: UterooCharacterProps) => {
  
  // Size classes based on the size prop - made larger as requested
  const sizeClasses = {
    small: "w-40 h-40",
    medium: "w-52 h-52",
    large: "w-64 h-64 sm:w-72 sm:h-72"
  };
  
  // State for automatic floating hearts
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [circlingEnemies, setCirclingEnemies] = useState<CirclingEnemy[]>([]);
  const [isHappy, setIsHappy] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [lastEnemyRespawnTime, setLastEnemyRespawnTime] = useState<number>(Date.now());
  
  // Determine current image and message based on happiness state
  const characterImage = isHappy ? happyUterooImage : sadUterooImage;
  
  // Update message based on happiness state and phase
  useEffect(() => {
    if (isHappy) {
      setCurrentMessage(happyMessages[phase]);
    } else {
      setCurrentMessage(sadMessages[phase]);
    }
  }, [isHappy, phase]);
  
  // Initialize circling enemies when enemies prop changes
  useEffect(() => {
    if (enemies.length > 0) {
      const newCirclingEnemies = enemies.map((enemy, index) => ({
        id: enemy.id,
        angle: (index * (360 / enemies.length)) * (Math.PI / 180), // Convert to radians
        distance: 80 + Math.random() * 20, // Base distance with some variation
        speed: 0.01 + Math.random() * 0.005, // Different speeds for each enemy
        icon: enemy.icon,
        name: enemy.name,
        hp: enemy.hp
      }));
      setCirclingEnemies(newCirclingEnemies);
      
      // If enemies exist, Uteroo should be sad
      setIsHappy(false);
    } else {
      setCirclingEnemies([]);
      
      // If no enemies, Uteroo should be happy
      if (!isHappy) {
        setIsHappy(true);
        // Play happy sound when becoming happy
        audioService.play('bonus');
        
        // Notify parent component that enemies are defeated
        if (onEnemiesDefeated) {
          onEnemiesDefeated();
        }
        
        // Set timer for enemy respawn (5 hours = 18000000 ms)
        // For testing purposes, using 30 seconds instead
        setTimeout(() => {
          setLastEnemyRespawnTime(Date.now());
          setIsHappy(false);
          // In a real implementation, this would trigger enemy respawn in the parent component
        }, 30000); // 30 seconds for testing - change to 18000000 for 5 hours
      }
    }
  }, [enemies, isHappy, onEnemiesDefeated]);
  
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
  
  // Play gentler sound for phase transition
  useEffect(() => {
    audioService.play(phaseToSound[phase]);
  }, [phase]);
  
  // Handle click on character with sound
  const handleClick = useCallback(() => {
    // Play different sounds based on happiness state
    if (isHappy) {
      audioService.play('bonus'); // Happy sound
    } else {
      audioService.play('gentle_waves'); // Comforting sound
    }
    
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
  }, [onClick, isHappy]);

  if (minimal) {
    // Minimal version without message bubble - just the character
    return (
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <img 
            src={characterImage} 
            alt={`Uteroo in ${phase} phase - ${isHappy ? 'happy' : 'sad'}`} 
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
          alt={`Uteroo in ${phase} phase - ${isHappy ? 'happy' : 'sad'}`} 
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
        "mt-4 font-medium tracking-wide text-white drop-shadow-md backdrop-blur-sm border border-white/30 rounded-full px-4 py-2",
        size === "small" ? "text-sm min-w-[180px]" : "text-base min-w-[220px]",
        isHappy ? "bg-green-500/20" : "bg-purple-500/20"
      )}>
        <div className="flex items-center gap-2 justify-center whitespace-normal">
          <span>{phaseToEmoji[phase]}</span>
          <span>{currentMessage}</span>
          <span>{isHappy ? "😊" : "😔"}</span>
        </div>
      </div>
    </div>
  );
};
