
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { audioService } from "@/utils/audioService";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";
type EmotionalState = "happy" | "sad";

interface Enemy {
  id: string;
  name: string;
  hp: number;
  icon: string;
  suggestion: string;
}

// Happy Uteroo images for each phase
const phaseToHappyImage = {
  menstruation: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  follicular: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  ovulatory: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  luteal: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png"
};

// Sad Uteroo images for each phase (using the attached images)
const phaseToSadImage = {
  menstruation: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png",
  follicular: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png",
  ovulatory: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png",
  luteal: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png"
};

// Lab coat versions
const phaseToHappyLabImage = {
  menstruation: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  follicular: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  ovulatory: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png",
  luteal: "/lovable-uploads/9ec8afcf-fc18-4524-8cdf-ccf7730637ae.png"
};

const phaseToSadLabImage = {
  menstruation: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png",
  follicular: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png",
  ovulatory: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png",
  luteal: "/lovable-uploads/2b9db306-0321-4afe-a659-0a5001878f87.png"
};

const phaseToEmoji = {
  menstruation: "🌸",
  follicular: "🌱",
  ovulatory: "☀️",
  luteal: "🍂"
};

const phaseToHappyMessage = {
  menstruation: "Feeling better with self-care! 💕",
  follicular: "Energy is flowing - let's grow! 🌱",
  ovulatory: "Radiating confidence and joy! ✨",
  luteal: "Peaceful and content! 🍂"
};

const phaseToSadMessage = {
  menstruation: "Struggling with symptoms... 😔",
  follicular: "Feeling a bit low today... 💙",
  ovulatory: "Not quite myself right now... 😢",
  luteal: "Need some extra care... 💜"
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
  // Determine emotional state based on enemies
  const emotionalState: EmotionalState = enemies.length > 0 ? "sad" : "happy";
  
  // Use lab coat image if in lab room
  const isLabRoom = currentRoom === "lab";
  
  // Choose the appropriate image based on emotional state and room
  const getCharacterImage = () => {
    if (isLabRoom) {
      return emotionalState === "happy" ? phaseToHappyLabImage[phase] : phaseToSadLabImage[phase];
    } else {
      return emotionalState === "happy" ? phaseToHappyImage[phase] : phaseToSadImage[phase];
    }
  };
  
  const characterImage = getCharacterImage();
  
  // Size classes based on the size prop - made larger as requested
  const sizeClasses = {
    small: "w-40 h-40",
    medium: "w-52 h-52",
    large: "w-64 h-64 sm:w-72 sm:h-72"
  };
  
  // State for automatic floating hearts
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [currentMessage, setCurrentMessage] = useState(
    emotionalState === "happy" ? phaseToHappyMessage[phase] : phaseToSadMessage[phase]
  );
  const [circlingEnemies, setCirclingEnemies] = useState<CirclingEnemy[]>([]);
  
  // Update message when emotional state or phase changes
  useEffect(() => {
    const newMessage = emotionalState === "happy" ? phaseToHappyMessage[phase] : phaseToSadMessage[phase];
    setCurrentMessage(newMessage);
    
    // Play different sounds based on emotional state
    if (emotionalState === "happy") {
      audioService.play('magic_sparkle'); // Happy sound
    } else {
      audioService.play(phaseToSound[phase]); // Gentle sound for sad state
    }
  }, [emotionalState, phase]);
  
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
  
  // Handle click on character with sound
  const handleClick = useCallback(() => {
    // Play different sounds based on emotional state
    if (emotionalState === "happy") {
      audioService.play('bonus'); // Happy click sound
    } else {
      audioService.play('gentle_waves'); // Gentle, comforting sound for sad state
    }
    
    // Add a random variation for happy state
    if (emotionalState === "happy" && Math.random() > 0.7) {
      audioService.play('magic_sparkle');
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
  }, [onClick, emotionalState]);

  if (minimal) {
    // Minimal version without message bubble - just the character
    return (
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <img 
            src={characterImage} 
            alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''} feeling ${emotionalState}`} 
            className={cn(
              sizeClasses[size],
              "object-contain drop-shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95",
              // Add a gentle glow effect for happy state
              emotionalState === "happy" && "filter drop-shadow-lg",
              // Add a subtle desaturated effect for sad state
              emotionalState === "sad" && "filter brightness-75 contrast-75"
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
              <Heart className={cn(
                "h-5 w-5 fill-current",
                emotionalState === "happy" ? "text-pink-500 fill-pink-500" : "text-blue-300 fill-blue-300"
              )} />
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
          alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''} feeling ${emotionalState}`} 
          className={cn(
            sizeClasses[size],
            "object-contain drop-shadow-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95",
            // Add a gentle glow effect for happy state
            emotionalState === "happy" && "filter drop-shadow-lg brightness-110",
            // Add a subtle desaturated effect for sad state
            emotionalState === "sad" && "filter brightness-75 contrast-75 saturate-75"
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
            <Heart className={cn(
              "h-5 w-5 fill-current",
              emotionalState === "happy" ? "text-pink-500 fill-pink-500" : "text-blue-300 fill-blue-300"
            )} />
          </div>
        ))}
      </div>
      
      <div className={cn(
        "mt-4 font-medium tracking-wide text-white drop-shadow-md backdrop-blur-sm border rounded-full px-4 py-2 transition-all duration-300",
        size === "small" ? "text-sm min-w-[180px]" : "text-base min-w-[220px]",
        // Different styling based on emotional state
        emotionalState === "happy" 
          ? "bg-gradient-to-r from-pink-400/80 to-purple-400/80 border-pink-300/50" 
          : "bg-gradient-to-r from-blue-400/80 to-gray-400/80 border-blue-300/50"
      )}>
        <div className="flex items-center gap-2 justify-center whitespace-normal">
          <span>{phaseToEmoji[phase]}</span>
          <span>{currentMessage}</span>
          {emotionalState === "happy" && <span>💕</span>}
          {emotionalState === "sad" && <span>💙</span>}
        </div>
      </div>
    </div>
  );
};
