
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { audioService } from "@/utils/audioService";
import { UterooCharacter } from "./UterooCharacter";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [animationStage, setAnimationStage] = useState<'sleeping' | 'waking' | 'awake' | 'complete'>('sleeping');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showTagline, setShowTagline] = useState(false);
  
  // Setup the animation sequence
  useEffect(() => {
    // Start the sleeping animation
    const wakeTimeout = setTimeout(() => {
      audioService.play('toy_squeak'); // Yawn sound
      setAnimationStage('waking');
      
      // After waking, show hearts
      setTimeout(() => {
        setAnimationStage('awake');
        audioService.play('magic_sparkle'); // Hearts appear sound
        
        // Show tagline with typewriter effect
        setTimeout(() => {
          setShowTagline(true);
          
          // Complete animation and transition to app
          setTimeout(() => {
            audioService.play('cute_bell'); // Wind chime sound
            setAnimationStage('complete');
            setTimeout(() => onComplete(), 500);
          }, 1200);
        }, 600);
      }, 1000);
    }, 800);

    // Simulate loading progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 15;
        return next >= 100 ? 100 : next;
      });
    }, 200);

    return () => {
      clearTimeout(wakeTimeout);
      clearInterval(loadingInterval);
    };
  }, [onComplete]);

  return (
    <div className={cn(
      "fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-500 bg-white",
      animationStage === 'complete' ? "opacity-0" : "opacity-100"
    )}>
      {/* Subtle floating hormone icons */}
      <div className="absolute top-1/4 left-1/4 text-2xl opacity-30 animate-pulse text-pink-400">🌱</div>
      <div className="absolute bottom-1/3 right-1/4 text-2xl opacity-30 animate-pulse text-pink-400" style={{ animationDelay: "1s" }}>🌕</div>
      
      <div className="relative flex flex-col items-center z-10">
        {/* Uteroo character with animation states */}
        <div className={cn(
          "transition-transform duration-700 ease-in-out",
          animationStage === 'sleeping' && "scale-90 -rotate-12",
          animationStage === 'waking' && "scale-95 rotate-0",
          (animationStage === 'awake' || animationStage === 'complete') && "scale-100"
        )}>
          <UterooCharacter 
            phase="menstruation" 
            minimal={!showTagline} 
            size="large"
          />
        </div>
        
        {/* Tagline with typewriter effect */}
        {showTagline && (
          <div className="mt-6 text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 drop-shadow-sm typewriter-text">
              Your cycle, understood 🌸
            </h2>
          </div>
        )}
        
        {/* Flower loading indicator */}
        <div className="absolute -bottom-16 w-full">
          <div className="w-full flex items-center justify-center">
            <div className="relative w-48 h-4">
              <div className="absolute inset-0 bg-pink-100 rounded-full"></div>
              <div 
                className="absolute inset-y-0 left-0 bg-pink-400 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
              <div className="absolute -top-4 -ml-2" style={{ left: `${loadingProgress}%` }}>
                <span className="text-lg">🌷</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
