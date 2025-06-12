
import { cn } from "@/lib/utils";
import { Heart, Flower } from "lucide-react";
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
const happyUterooImage = "/lovable-uploads/50167af2-3f66-47c1-aadb-96e97717d531.png";

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

// Hormonal level tooltips for each phase
const phaseToHormonalTips = {
  menstruation: {
    estrogen: "Estrogen is at its lowest - time to rest and be gentle with yourself! 💕",
    progesterone: "Progesterone drops sharply - this triggers your period and may affect mood 🌸",
    testosterone: "Testosterone is low - perfect time for gentle, restorative activities 🕯️"
  },
  follicular: {
    estrogen: "Estrogen starts rising - you'll feel more energetic and optimistic! ✨",
    progesterone: "Progesterone stays low - great time to start new projects 🌱",
    testosterone: "Testosterone begins to climb - motivation and confidence are building! 💪"
  },
  ovulatory: {
    estrogen: "Estrogen peaks - you're at your most radiant and social! 🌟",
    progesterone: "Progesterone starts to rise - preparing your body for potential pregnancy 🌺",
    testosterone: "Testosterone surges - peak energy and libido time! 🔥"
  },
  luteal: {
    estrogen: "Estrogen fluctuates then drops - this can affect mood and energy 🍂",
    progesterone: "Progesterone is high - promoting calm but may cause PMS symptoms 🌙",
    testosterone: "Testosterone gradually decreases - time to slow down and nurture yourself 🤗"
  }
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

// Interface for hormonal tooltip
interface HormonalTooltip {
  hormone: string;
  text: string;
  x: number;
  y: number;
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
  const [activeTooltip, setActiveTooltip] = useState<HormonalTooltip | null>(null);
  
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

  // Handle hormonal icon click
  const handleHormonalIconClick = (hormone: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltip: HormonalTooltip = {
      hormone,
      text: phaseToHormonalTips[phase][hormone as keyof typeof phaseToHormonalTips[typeof phase]],
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    };
    
    setActiveTooltip(tooltip);
    
    // Auto-hide tooltip after 3 seconds
    setTimeout(() => {
      setActiveTooltip(null);
    }, 3000);
  };

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
                marginLeft: '-32px', // Half of enemy size (64px)
                marginTop: '-32px'
              }}
            >
              <div className="relative">
                <img 
                  src={enemy.icon} 
                  alt={enemy.name}
                  className="w-16 h-16 object-contain drop-shadow-lg animate-pulse"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.3))'
                  }}
                />
                {/* Menacing glow effect */}
                <div className="absolute inset-0 w-16 h-16 bg-red-500 opacity-20 rounded-full animate-ping" />
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
        
        {/* Hormonal Level Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
          {/* Estrogen */}
          <div 
            className="relative cursor-pointer animate-pulse"
            onClick={(e) => handleHormonalIconClick('estrogen', e)}
          >
            <Flower className="h-4 w-4 text-pink-400 animate-pulse" />
            <div className="absolute inset-0 h-4 w-4 bg-pink-400 opacity-30 rounded-full animate-ping" />
          </div>
          
          {/* Progesterone */}
          <div 
            className="relative cursor-pointer animate-pulse"
            onClick={(e) => handleHormonalIconClick('progesterone', e)}
          >
            <Flower className="h-4 w-4 text-purple-400 animate-pulse" />
            <div className="absolute inset-0 h-4 w-4 bg-purple-400 opacity-30 rounded-full animate-ping" />
          </div>
          
          {/* Testosterone */}
          <div 
            className="relative cursor-pointer animate-pulse"
            onClick={(e) => handleHormonalIconClick('testosterone', e)}
          >
            <Flower className="h-4 w-4 text-orange-400 animate-pulse" />
            <div className="absolute inset-0 h-4 w-4 bg-orange-400 opacity-30 rounded-full animate-ping" />
          </div>
        </div>
        
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
      
      {/* Hormonal Tooltip */}
      {activeTooltip && (
        <div 
          className="fixed z-50 bg-white/95 backdrop-blur-sm border-2 border-pink-300 rounded-lg px-3 py-2 shadow-lg max-w-64 pointer-events-none"
          style={{
            left: activeTooltip.x,
            top: activeTooltip.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="text-xs font-medium text-gray-800 text-center leading-tight">
            {activeTooltip.text}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-pink-300"></div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-2px] w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent border-t-white"></div>
        </div>
      )}
      
      <div className={cn(
        "mt-4 font-medium tracking-wide text-gray-800 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg",
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
