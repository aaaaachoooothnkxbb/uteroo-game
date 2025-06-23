
import { useState, useEffect } from 'react';
import { calculateCycleFromData, CycleCalculation, CyclePhase } from '@/utils/cycleCalculations';

interface CycleData {
  date: string;
  flow?: "light" | "medium" | "heavy";
  symptoms?: string[];
  mood?: "happy" | "sad" | "anxious";
  phase?: CyclePhase;
}

export const useCycleTracking = () => {
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [currentCycleInfo, setCurrentCycleInfo] = useState<CycleCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cycle data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('cycleData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCycleData(parsedData);
      } catch (error) {
        console.error('Error parsing cycle data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Calculate current cycle info whenever cycle data changes
  useEffect(() => {
    if (cycleData.length > 0) {
      const cycleInfo = calculateCycleFromData(cycleData);
      setCurrentCycleInfo(cycleInfo);
    } else {
      setCurrentCycleInfo(null);
    }
  }, [cycleData]);

  // Save cycle data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cycleData', JSON.stringify(cycleData));
    }
  }, [cycleData, isLoading]);

  const addCycleEntry = (entry: CycleData) => {
    setCycleData(prev => {
      // Remove existing entry for the same date if it exists
      const filtered = prev.filter(item => item.date !== entry.date);
      // Add new entry and sort by date
      return [...filtered, entry].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  };

  const updateCycleEntry = (date: string, updates: Partial<CycleData>) => {
    setCycleData(prev => 
      prev.map(item => 
        item.date === date ? { ...item, ...updates } : item
      )
    );
  };

  const getCurrentPhase = (): CyclePhase => {
    if (currentCycleInfo) {
      return currentCycleInfo.currentPhase;
    }
    // Default fallback
    return 'follicular';
  };

  const getCurrentDay = (): number => {
    return currentCycleInfo?.currentDay || 1;
  };

  const getCycleLength = (): number => {
    return currentCycleInfo?.cycleLength || 28;
  };

  return {
    cycleData,
    currentCycleInfo,
    isLoading,
    addCycleEntry,
    updateCycleEntry,
    getCurrentPhase,
    getCurrentDay,
    getCycleLength,
    setCycleData
  };
};
