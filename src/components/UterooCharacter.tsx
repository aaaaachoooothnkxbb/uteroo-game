
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { audioService } from "@/utils/audioService";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { AvatarOptions } from "@/types/avatar";

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

// Companion avatar images based on animal type
const companionImages = {
  fox: "/lovable-uploads/0d497106-a6a3-4251-ac48-6e002ce44c94.png",
  bear: "/lovable-uploads/2609640b-f01c-4bbe-ba7a-2a29da3be432.png", 
  cat: "/lovable-uploads/38331f05-68ba-498a-9a0f-eafcd0ed1291.png",
  owl: "/lovable-uploads/615abf15-2229-43a2-90d2-4b9a3412fd54.png",
  rabbit: "/lovable-uploads/647c4f54-a00f-4440-9f67-ed9a4cef9936.png"
};

export const UterooCharacter = ({ 
  phase, 
  currentRoom = "", 
  size = "medium", 
  minimal = false,
  onClick,
  enemies = []
}: UterooCharacterProps) => {
  const { user } = useAuth();
  const [userAvatar, setUserAvatar] = useState<AvatarOptions | null>(null);
  const [showItemGiving, setShowItemGiving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Fetch user's companion avatar
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!user) {
        console.log('No user found, cannot fetch avatar');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching user avatar for user:', user.id);
        
        // Check if profile exists first
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            console.log('Profile not found, creating one...');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ 
                id: user.id,
                username: user.email?.split('@')[0] || 'User'
              });
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
            }
          }
          setIsLoading(false);
          return;
        }
        
        console.log('Full profile data:', profile);
        
        if (profile && profile.avatar_animal) {
          const avatarData = {
            animal: profile.avatar_animal,
            color: profile.avatar_color || 'brown',
            accessory: profile.avatar_accessory || 'none'
          };
          
          setUserAvatar(avatarData);
          console.log('Set user avatar:', avatarData);
        } else {
          console.log('No avatar data found for user, profile:', profile);
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAvatar();
  }, [user]);
  
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
  
  // Handle click on character with companion interaction
  const handleClick = useCallback(() => {
    // Show companion giving item animation
    setShowItemGiving(true);
    setTimeout(() => setShowItemGiving(false), 2000);
    
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
  
  // Get companion image
  const companionImage = userAvatar?.animal ? companionImages[userAvatar.animal as keyof typeof companionImages] : null;
  
  console.log('Rendering with companion:', { 
    userAvatar, 
    companionImage, 
    isLoading,
    hasCompanionData: !!userAvatar?.animal,
    availableAnimals: Object.keys(companionImages)
  });
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center gap-4">
        {/* Companion Avatar - Show if we have avatar data OR show loading state */}
        {isLoading && user ? (
          <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
            <span className="text-gray-500 text-sm">Loading...</span>
          </div>
        ) : userAvatar?.animal && companionImage ? (
          <div className="relative">
            <img 
              src={companionImage}
              alt={`${userAvatar.animal} companion`}
              className={cn(
                "object-contain drop-shadow-md transition-transform",
                size === "small" ? "w-24 h-24" : 
                size === "medium" ? "w-32 h-32" : 
                "w-40 h-40",
                showItemGiving && "animate-bounce"
              )}
              style={{
                filter: userAvatar.color && userAvatar.color !== 'brown' 
                  ? `hue-rotate(${userAvatar.color === 'orange' ? '30deg' : 
                      userAvatar.color === 'white' ? '0deg' : 
                      userAvatar.color === 'black' ? '180deg' : 
                      userAvatar.color === 'grey' ? '90deg' : '0deg'})` 
                  : 'none'
              }}
            />
            
            {/* Sachet/Bag that companion holds */}
            <div className={cn(
              "absolute -right-2 bottom-2 transition-all duration-500",
              showItemGiving ? "translate-x-8 opacity-0" : "translate-x-0 opacity-100"
            )}>
              <img 
                src="/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png"
                alt="Companion's sachet"
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
            </div>
            
            {/* Item giving animation */}
            {showItemGiving && (
              <div className="absolute top-1/2 right-0 animate-ping">
                <div className="w-3 h-3 bg-pink-500 rounded-full opacity-75"></div>
              </div>
            )}
          </div>
        ) : user && !isLoading ? (
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
            <span className="text-gray-500 text-xs text-center px-2">No companion<br/>created yet</span>
          </div>
        ) : null}
        
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
                  marginLeft: '-32px',
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
                  <div className="absolute inset-0 w-16 h-16 bg-red-500 opacity-20 rounded-full animate-ping" />
                </div>
              </div>
            );
          })}
          
          {/* Main Uteroo Character */}
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

export default UterooCharacter;
