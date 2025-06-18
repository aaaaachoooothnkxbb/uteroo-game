
import React, { useState, useEffect } from 'react';

interface UterooCharacterProps {
  mood?: 'happy' | 'sad' | 'excited' | 'tired';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const UterooCharacter: React.FC<UterooCharacterProps> = ({ 
  mood = 'happy', 
  size = 'medium',
  className = ''
}) => {
  const [currentMood, setCurrentMood] = useState(mood);
  const [isAnimating, setIsAnimating] = useState(false);

  console.log('UterooCharacter render - mood:', mood, 'currentMood:', currentMood);

  // Fix the infinite loop by adding proper dependencies
  useEffect(() => {
    console.log('UterooCharacter useEffect - mood changed from', currentMood, 'to', mood);
    if (mood !== currentMood) {
      setCurrentMood(mood);
    }
  }, [mood, currentMood]); // Add proper dependencies

  // Animation effect with proper cleanup
  useEffect(() => {
    console.log('UterooCharacter animation effect');
    const animationInterval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 2000);

    return () => {
      console.log('UterooCharacter animation cleanup');
      clearInterval(animationInterval);
    };
  }, []); // Empty dependency array for animation

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'w-16 h-16';
      case 'large': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  const getMoodEmoji = () => {
    switch (currentMood) {
      case 'sad': return '😢';
      case 'excited': return '🤩';
      case 'tired': return '😴';
      default: return '😊';
    }
  };

  return (
    <div className={`flex items-center justify-center ${getSizeClass()} ${className}`}>
      <div className={`text-4xl transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        {getMoodEmoji()}
      </div>
    </div>
  );
};
