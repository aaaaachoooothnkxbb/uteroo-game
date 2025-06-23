
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface HealthSliderProps {
  questionText: string;
  emoji: string;
  minLabel: string;
  maxLabel: string;
  minValue: number;
  maxValue: number;
  value: number;
  onChange: (value: number) => void;
}

export const HealthSlider: React.FC<HealthSliderProps> = ({
  questionText,
  emoji,
  minLabel,
  maxLabel,
  minValue,
  maxValue,
  value,
  onChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValueTouch(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      updateValueTouch(e);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, 1 - (y / rect.height))); // Invert because top is max
    const newValue = Math.round(minValue + percentage * (maxValue - minValue));
    onChange(newValue);
  };

  const updateValueTouch = (e: TouchEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    
    const touch = e.type === 'touchstart' ? (e as React.TouchEvent).touches[0] : (e as TouchEvent).touches?.[0] || (e as TouchEvent).changedTouches?.[0];
    if (!touch) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, 1 - (y / rect.height))); // Invert because top is max
    const newValue = Math.round(minValue + percentage * (maxValue - minValue));
    onChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  // Calculate indicator position (inverted because top is max)
  const indicatorPosition = ((value - minValue) / (maxValue - minValue)) * 100;
  const invertedPosition = 100 - indicatorPosition;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium mb-2">{questionText}</h3>
          <div className="text-4xl mb-2">{emoji}</div>
          <div className="text-2xl font-bold text-primary">{value}</div>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Max label (top) */}
          <div className="text-sm font-medium text-gray-600 text-center">
            {maxLabel}
          </div>
          
          {/* Vertical slider */}
          <div className="relative">
            <div
              ref={sliderRef}
              className="w-8 h-64 bg-gradient-to-t from-red-200 via-yellow-200 to-green-200 rounded-full cursor-pointer relative border-2 border-gray-300"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {/* Slider track marks */}
              <div className="absolute left-0 w-full h-full">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 w-full h-0.5 bg-gray-400 opacity-30"
                    style={{ top: `${i * 25}%` }}
                  />
                ))}
              </div>
              
              {/* Draggable indicator */}
              <div
                className="absolute w-12 h-12 bg-white rounded-full shadow-lg border-2 border-primary flex items-center justify-center text-2xl cursor-grab active:cursor-grabbing transform -translate-x-2 -translate-y-6 transition-all duration-150"
                style={{ 
                  top: `${invertedPosition}%`,
                  left: '50%',
                  transform: `translate(-50%, -50%) ${isDragging ? 'scale(1.1)' : 'scale(1)'}`
                }}
              >
                {emoji}
              </div>
            </div>
          </div>
          
          {/* Min label (bottom) */}
          <div className="text-sm font-medium text-gray-600 text-center">
            {minLabel}
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Drag the {emoji} to set your level
        </div>
      </CardContent>
    </Card>
  );
};
