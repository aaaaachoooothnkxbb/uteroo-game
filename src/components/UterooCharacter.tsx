
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { audioService } from "@/utils/audioService";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

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

// Phase symptoms for thought bubbles
const phaseToSymptoms = {
  menstruation: ["I have cramps", "I feel so tired", "My back hurts"],
  follicular: ["I'm feeling anxious", "I have a headache", "I feel restless"],
  ovulatory: ["I'm extra sensitive today", "I have a migraine", "I feel bloated"],
  luteal: ["I'm so irritable", "I feel sad", "I have no energy"]
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
}

// Interface for floating hearts
interface FloatingHeart {
  id: string;
  x: number;
  y: number;
  opacity: number;
}

export const UterooCharacter = ({ 
  phase, 
  currentRoom = "", 
  size = "medium", 
  minimal = false,
  onClick
}: UterooCharacterProps) => {
  // Use lab coat image if in lab room
  const isLabRoom = currentRoom === "lab";
  const characterImage = isLabRoom ? phaseToLabImage[phase] : phaseToImage[phase];
  
  // Size classes based on the size prop - made larger as requested
  const sizeClasses = {
    small: "w-40 h-40",
    medium: "w-52 h-52",
    large: "w-64 h-64 sm:w-72 sm:h-72"
  };
  
  // State for automatic floating hearts
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [currentMessage, setCurrentMessage] = useState(phaseToMessage[phase]);
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const [showSymptoms, setShowSymptoms] = useState(false);
  
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

  // Randomly show symptoms occasionally
  useEffect(() => {
    const symptoms = phaseToSymptoms[phase];
    
    // Set up interval to occasionally show a symptom
    const symptomInterval = setInterval(() => {
      if (!showSymptoms && Math.random() > 0.7) {
        const randomSymptom = symptoms[Math.floor(Math.random() * symptoms.length)];
        setActiveSymptom(randomSymptom);
        setShowSymptoms(true);
        
        // Hide symptom after a few seconds
        setTimeout(() => {
          setShowSymptoms(false);
        }, 4000);
      }
    }, 8000);
    
    return () => clearInterval(symptomInterval);
  }, [phase, showSymptoms]);
  
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

    // Show a random symptom when clicked with higher probability
    const symptoms = phaseToSymptoms[phase];
    if (Math.random() > 0.3) {
      const randomSymptom = symptoms[Math.floor(Math.random() * symptoms.length)];
      setActiveSymptom(randomSymptom);
      setShowSymptoms(true);
      
      // Hide symptom after a few seconds
      setTimeout(() => {
        setShowSymptoms(false);
      }, 4000);
    }
    
    if (onClick) {
      onClick();
    }
  }, [phase, onClick]);

  if (minimal) {
    // Minimal version without message bubble - just the character
    return (
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <img 
            src={characterImage} 
            alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
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
        {/* Symptom thought bubble */}
        {showSymptoms && activeSymptom && (
          <div className={cn(
            "absolute z-10 -top-16 -right-8 max-w-[180px] text-sm px-4 py-3 rounded-xl",
            "bg-white/90 shadow-md backdrop-blur-sm animate-bounce-slow",
            "before:content-[''] before:absolute before:bottom-0 before:right-6 before:w-4 before:h-4",
            "before:bg-white/90 before:rotate-45 before:translate-y-2",
            phase === "menstruation" ? "before:bg-pink-100/90 bg-pink-100/90 text-pink-800" :
            phase === "follicular" ? "before:bg-green-100/90 bg-green-100/90 text-green-800" :
            phase === "ovulatory" ? "before:bg-yellow-100/90 bg-yellow-100/90 text-yellow-800" :
            "before:bg-orange-100/90 bg-orange-100/90 text-orange-800"
          )}>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="Symptom" className="text-lg">
                {phase === "menstruation" ? "😣" :
                 phase === "follicular" ? "😰" :
                 phase === "ovulatory" ? "😵" :
                 "😤"}
              </span>
              <span className="font-medium italic">{activeSymptom}</span>
            </div>
          </div>
        )}
        
        <img 
          src={characterImage} 
          alt={`Uteroo in ${phase} phase${isLabRoom ? ' with lab coat' : ''}`} 
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
        "mt-4 font-medium tracking-wide text-white drop-shadow-md bg-gradient-to-r rounded-full backdrop-blur-sm border border-white/30 px-4 py-2",
        size === "small" ? "text-sm min-w-[180px]" : "text-base min-w-[220px]",
        phase === "menstruation" ? "from-pink-500 to-pink-400" :
        phase === "follicular" ? "from-green-500 to-green-400" :
        phase === "ovulatory" ? "from-yellow-500 to-yellow-400" :
        "from-orange-500 to-orange-400"
      )}>
        <div className="flex items-center gap-2 justify-center whitespace-normal">
          <span>{phaseToEmoji[phase]}</span>
          <span>{currentMessage}</span>
        </div>
      </div>
    </div>
  );
};
