
import { parseISO, differenceInDays, addDays, format } from 'date-fns';

export type CyclePhase = "menstruation" | "follicular" | "ovulatory" | "luteal";

export interface CycleCalculation {
  currentDay: number;
  currentPhase: CyclePhase;
  cycleLength: number;
  daysSinceLastPeriod: number;
  nextPeriodDate: Date;
  ovulationDate: Date;
  isOnPeriod: boolean;
}

export interface PeriodData {
  date: string;
  flow?: "light" | "medium" | "heavy";
}

export const calculateCycleInfo = (
  lastPeriodDate: Date,
  cycleLength: number = 28,
  periodLength: number = 5,
  today: Date = new Date()
): CycleCalculation => {
  const daysSinceLastPeriod = differenceInDays(today, lastPeriodDate);
  
  // Calculate current cycle day (1-based)
  let currentDay = (daysSinceLastPeriod % cycleLength) + 1;
  
  // If we're past the cycle length, we're in a new cycle
  if (daysSinceLastPeriod >= cycleLength) {
    currentDay = (daysSinceLastPeriod % cycleLength) + 1;
  }
  
  // Determine phase based on cycle day
  let currentPhase: CyclePhase;
  const ovulationDay = Math.round(cycleLength - 14); // Luteal phase is typically 14 days
  
  if (currentDay <= periodLength) {
    currentPhase = "menstruation";
  } else if (currentDay < ovulationDay - 2) {
    currentPhase = "follicular";
  } else if (currentDay >= ovulationDay - 2 && currentDay <= ovulationDay + 2) {
    currentPhase = "ovulatory";
  } else {
    currentPhase = "luteal";
  }
  
  // Calculate next period and ovulation dates
  const cyclesSinceLastPeriod = Math.floor(daysSinceLastPeriod / cycleLength);
  const nextPeriodDate = addDays(lastPeriodDate, (cyclesSinceLastPeriod + 1) * cycleLength);
  const ovulationDate = addDays(lastPeriodDate, cyclesSinceLastPeriod * cycleLength + ovulationDay);
  
  const isOnPeriod = currentDay <= periodLength;
  
  return {
    currentDay,
    currentPhase,
    cycleLength,
    daysSinceLastPeriod,
    nextPeriodDate,
    ovulationDate,
    isOnPeriod
  };
};

export const calculateCycleFromData = (
  periodData: PeriodData[],
  today: Date = new Date()
): CycleCalculation | null => {
  if (periodData.length === 0) return null;
  
  // Sort period data by date (most recent first)
  const sortedPeriods = periodData
    .filter(p => p.flow) // Only include entries with flow data
    .map(p => ({ ...p, dateObj: parseISO(p.date) }))
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  
  if (sortedPeriods.length === 0) return null;
  
  const lastPeriod = sortedPeriods[0];
  
  // Calculate average cycle length if we have multiple periods
  let avgCycleLength = 28; // Default
  if (sortedPeriods.length >= 2) {
    const cycleLengths = [];
    for (let i = 0; i < sortedPeriods.length - 1; i++) {
      const daysBetween = differenceInDays(
        sortedPeriods[i].dateObj,
        sortedPeriods[i + 1].dateObj
      );
      if (daysBetween > 0 && daysBetween <= 45) { // Reasonable cycle length
        cycleLengths.push(daysBetween);
      }
    }
    
    if (cycleLengths.length > 0) {
      avgCycleLength = Math.round(
        cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
      );
    }
  }
  
  // Estimate period length (default to 5 days)
  const periodLength = 5;
  
  return calculateCycleInfo(lastPeriod.dateObj, avgCycleLength, periodLength, today);
};

export const formatCycleDay = (day: number, totalDays: number): string => {
  return `Day ${day}/${totalDays}`;
};

export const getPhaseDescription = (phase: CyclePhase): string => {
  const descriptions = {
    menstruation: "Your period - time for rest and self-care",
    follicular: "Rising energy - great time for new projects",
    ovulatory: "Peak energy and fertility - socialize and connect",
    luteal: "Winding down - focus on self-care and preparation"
  };
  return descriptions[phase];
};

export const getPhaseEmoji = (phase: CyclePhase): string => {
  const emojis = {
    menstruation: "🌸",
    follicular: "🌱", 
    ovulatory: "☀️",
    luteal: "🍂"
  };
  return emojis[phase];
};
