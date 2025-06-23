import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay, addMonths, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Moon, Sun, Droplets, Heart, CloudMoon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCycleTracking } from "@/hooks/useCycleTracking";
import { getPhaseDescription, getPhaseEmoji, formatCycleDay } from "@/utils/cycleCalculations";
import { CompanionNaming } from "./CompanionNaming";
import { useAuth } from "./AuthProvider";

type CyclePhase = "menstruation" | "follicular" | "ovulatory" | "luteal";

type CycleData = {
  date: string;
  flow?: "light" | "medium" | "heavy";
  symptoms?: string[];
  mood?: "happy" | "sad" | "anxious";
  phase?: CyclePhase;
};

type CycleSanctuaryProps = {
  currentPhase: CyclePhase;
  onPhaseChange: (phase: CyclePhase) => void;
};

const phaseInfo = {
  menstruation: {
    color: "bg-red-200 hover:bg-red-300",
    darkColor: "bg-red-500",
    name: "Menstruation",
    icon: Moon,
    duration: "3-7 days",
    description: "The start of your cycle when the uterine lining sheds."
  },
  follicular: {
    color: "bg-green-200 hover:bg-green-300",
    darkColor: "bg-green-500",
    name: "Follicular",
    icon: Droplets,
    duration: "7-21 days, varies by cycle",
    description: "Rising energy and creativity as estrogen levels increase."
  },
  ovulatory: {
    color: "bg-yellow-200 hover:bg-yellow-300",
    darkColor: "bg-yellow-500",
    name: "Ovulatory",
    icon: Sun,
    duration: "3-5 days",
    description: "Peak energy and fertility when an egg is released."
  },
  luteal: {
    color: "bg-orange-200 hover:bg-orange-300",
    darkColor: "bg-orange-500",
    name: "Luteal",
    icon: CloudMoon,
    duration: "10-14 days",
    description: "Winding down as progesterone rises and then falls."
  }
};

const symptoms = [
  { id: "cramps", name: "Cramp Monster", emoji: "🐉" },
  { id: "bloating", name: "Bloating Blob", emoji: "🎈" },
  { id: "headache", name: "Headache Hammer", emoji: "🔨" },
  { id: "fatigue", name: "Fatigue Fog", emoji: "☁️" },
  { id: "backache", name: "Backache Bear", emoji: "🐻" },
  { id: "moodswings", name: "Mood Swing Monkey", emoji: "🐒" },
];

const moods = [
  { id: "happy", name: "Happy", emoji: "🌈" },
  { id: "sad", name: "Sad", emoji: "☁️" },
  { id: "anxious", name: "Anxious", emoji: "⚡" },
];

export const CycleSanctuary: React.FC<CycleSanctuaryProps> = ({ currentPhase, onPhaseChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateData, setSelectedDateData] = useState<CycleData | null>(null);
  const [flow, setFlow] = useState<"light" | "medium" | "heavy" | undefined>();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<"happy" | "sad" | "anxious" | undefined>();
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [showPhaseInfo, setShowPhaseInfo] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCompanionNaming, setShowCompanionNaming] = useState(false);
  const [companionName, setCompanionName] = useState<string | null>(null);
  const { user } = useAuth();

  // Use the new cycle tracking hook
  const {
    cycleData,
    currentCycleInfo,
    isLoading,
    addCycleEntry,
    getCurrentPhase,
    getCurrentDay,
    getCycleLength
  } = useCycleTracking();

  // Check if user has a companion name
  useEffect(() => {
    const fetchCompanionName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('companion_name')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setCompanionName(data.companion_name);
        }
      }
    };
    
    fetchCompanionName();
  }, [user]);

  // Update parent component when calculated phase changes
  useEffect(() => {
    if (currentCycleInfo && currentCycleInfo.currentPhase !== currentPhase) {
      onPhaseChange(currentCycleInfo.currentPhase);
    }
  }, [currentCycleInfo, currentPhase, onPhaseChange]);

  // Fetch cycle data from Supabase or local storage
  useEffect(() => {
    // For now, we'll use localStorage for demonstration
    const savedStreak = localStorage.getItem('cycleStreak');
    const firstTimeUser = localStorage.getItem('firstTimeUser');
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
    
    if (firstTimeUser === null) {
      setIsFirstTimeUser(true);
      setShowOnboarding(true);
      localStorage.setItem('firstTimeUser', 'false');
    } else {
      setIsFirstTimeUser(false);
    }
    
    // Always set to the current date when component loads
    const today = new Date();
    setCurrentDate(today);
  }, []);

  // Set up a timer to refresh the date at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timerId = setTimeout(() => {
      setCurrentDate(new Date());
    }, timeUntilMidnight);
    
    return () => clearTimeout(timerId);
  }, [currentDate]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cycleData', JSON.stringify(cycleData));
  }, [cycleData]);

  // Get days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Handle date selection
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    const existingData = cycleData.find(data => isSameDay(parseISO(data.date), day));
    setSelectedDateData(existingData || null);
    setFlow(existingData?.flow);
    setSelectedSymptoms(existingData?.symptoms || []);
    setMood(existingData?.mood);
    setShowLogDialog(true);
  };

  // Handle saving log data
  const saveLogData = () => {
    const dateString = selectedDate?.toISOString() || new Date().toISOString();
    
    const newData: CycleData = {
      date: selectedDate?.toISOString() || new Date().toISOString(),
      flow,
      symptoms: selectedSymptoms,
      mood
    };
    
    addCycleEntry(newData);
    
    // If flow is logged, update phase immediately
    if (flow) {
      onPhaseChange("menstruation");
    }
    
    setShowLogDialog(false);
    
    // Update streak logic
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('cycleStreak', newStreak.toString());
    
    if (newStreak % 5 === 0) {
      toast({
        title: `🔥 ${newStreak}-day logging streak!`,
        description: "You've unlocked Period Oracle mode!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Entry logged!",
        description: "Keep up the streak for rewards!",
        duration: 3000,
      });
    }
    
    // Clear form
    setFlow(undefined);
    setSelectedSymptoms([]);
    setMood(undefined);
  };

  // Helper function to determine cell color based on data
  const getCellColor = (day: Date) => {
    if (!isSameMonth(day, currentDate)) return "bg-gray-100";
    
    const dayData = cycleData.find(data => isSameDay(parseISO(data.date), day));
    
    if (dayData?.phase && !isPrivateMode) {
      return phaseInfo[dayData.phase].color;
    }
    
    if (isToday(day)) return "bg-blue-200";
    
    return "bg-white hover:bg-gray-100";
  };

  // Get cell content (flow indicators, etc)
  const getCellContent = (day: Date) => {
    if (!isSameMonth(day, currentDate)) return null;
    
    const dayData = cycleData.find(data => isSameDay(parseISO(data.date), day));
    if (!dayData || isPrivateMode) return null;
    
    return (
      <div className="flex flex-col items-center">
        {dayData.flow && (
          <div className="text-xs">
            {dayData.flow === "light" && "💧"}
            {dayData.flow === "medium" && "💧💧"}
            {dayData.flow === "heavy" && "💧💧💧"}
          </div>
        )}
        {dayData.mood && (
          <div className="text-xs">
            {dayData.mood === "happy" && "🌈"}
            {dayData.mood === "sad" && "☁️"}
            {dayData.mood === "anxious" && "⚡"}
          </div>
        )}
      </div>
    );
  };

  // Handle symptom toggle
  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  // Change month handlers
  const handlePreviousMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  // Get predicted period dates (simple version for now)
  const getPredictedPeriodClass = (day: Date) => {
    // This is a simplified prediction just for demo purposes
    // A real implementation would use past cycle data to predict
    
    if (isPrivateMode) return "";
    
    const menstruationDates = cycleData
      .filter(data => data.phase === "menstruation")
      .map(data => parseISO(data.date));
    
    if (menstruationDates.length < 2) return "";
    
    // Sort dates from oldest to newest
    menstruationDates.sort((a, b) => a.getTime() - b.getTime());
    
    // Get the most recent period start
    const lastPeriod = menstruationDates[menstruationDates.length - 1];
    
    // Simple 28-day cycle prediction for demo
    const nextPredicted = new Date(lastPeriod);
    nextPredicted.setDate(lastPeriod.getDate() + 28);
    
    // Highlight a 5-day window
    const isPredicted = day >= nextPredicted && 
      day <= new Date(nextPredicted.getFullYear(), nextPredicted.getMonth(), nextPredicted.getDate() + 4);
    
    return isPredicted ? "border-2 border-red-500" : "";
  };

  // Pet Button - Floating button in top right
  const handlePetButtonClick = () => {
    if (!companionName) {
      setShowCompanionNaming(true);
    } else {
      // Future: Show pet interaction menu
      toast({
        title: `Hello ${companionName}!`,
        description: "Pet interactions coming soon!",
        duration: 3000,
      });
    }
  };

  const handleCompanionNamingComplete = (name: string) => {
    setCompanionName(name);
    setShowCompanionNaming(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Pet Button - Floating button in top right */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={handlePetButtonClick}
          className="rounded-full w-16 h-16 bg-pink-500 hover:bg-pink-600 shadow-lg"
          size="icon"
        >
          <div className="text-2xl">
            {companionName ? "🐾" : "❓"}
          </div>
        </Button>
      </div>

      {/* Companion Naming Modal */}
      {showCompanionNaming && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <CompanionNaming 
            onComplete={handleCompanionNamingComplete}
          />
        </div>
      )}

      {/* Onboarding dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Welcome to your Cycle Sanctuary! 🏩</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-8 w-8 text-pink-500" />
                  <span>Log periods & symptoms → Colors show your phase!</span>
                </div>
                <div className="flex items-center gap-3">
                  <CloudMoon className="h-8 w-8 text-purple-500" />
                  <span>Predictions get smarter the more you track.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <span>Syncs with all Uteroo rooms—let's make cycles easier! 🌟</span>
                </div>
                <div className="mt-6 text-center font-bold">
                  Tap a date to start! First log = +50 points! 💖
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={() => setShowOnboarding(false)}>Let's Go!</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar section with proper scrolling */}
      <ScrollArea className="flex-1 overflow-y-auto pr-4">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Cycle Sanctuary
              {isPrivateMode ? (
                <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">🔒 Private</span>
              ) : null}
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsPrivateMode(!isPrivateMode)}
                className="pointer-events-auto"
              >
                {isPrivateMode ? "Show Details" : "Private Mode"} 
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="pointer-events-auto">
                    <span className="flex items-center">
                      <span className="mr-1">🔥</span> 
                      {streak}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 pointer-events-auto">
                  <div className="space-y-2">
                    <h3 className="font-medium">Your Tracking Streak</h3>
                    <p className="text-sm text-muted-foreground">
                      You've logged your cycle for {streak} days. Keep it up to unlock special rewards!
                    </p>
                    {streak >= 5 && (
                      <div className="bg-yellow-100 p-2 rounded">
                        <span className="font-bold">🏅 Unlocked: Period Oracle</span>
                        <p className="text-xs">Your predictions are now more accurate!</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Cycle Info Display */}
          {currentCycleInfo && !isPrivateMode && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {getPhaseEmoji(currentCycleInfo.currentPhase)}
                    {formatCycleDay(currentCycleInfo.currentDay, currentCycleInfo.cycleLength)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getPhaseDescription(currentCycleInfo.currentPhase)}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Next period: {format(currentCycleInfo.nextPeriodDate, 'MMM d')}</p>
                  <p>Ovulation: {format(currentCycleInfo.ovulationDate, 'MMM d')}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handlePreviousMonth} variant="outline" size="sm" className="pointer-events-auto">Previous</Button>
            <h3 className="text-lg font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
            <Button onClick={handleNextMonth} variant="outline" size="sm" className="pointer-events-auto">Next</Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {Object.entries(phaseInfo).map(([phase, info]) => (
              <Popover key={phase}>
                <PopoverTrigger asChild>
                  <div 
                    className={`flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer pointer-events-auto ${info.color}`}
                    onClick={() => onPhaseChange(phase as CyclePhase)}
                  >
                    <info.icon className="h-4 w-4" />
                    <span className="text-xs">{info.name}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 pointer-events-auto">
                  <div className="space-y-2">
                    <h3 className="font-medium">{info.name} Phase</h3>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                    <p className="text-xs">
                      <span className="font-bold">Typical duration:</span> {info.duration}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>

          {/* Calendar grid with proper sizing for mobile */}
          <div className="grid grid-cols-7 gap-1 pointer-events-auto">
            {/* Day labels */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs font-medium p-1 pointer-events-auto">
                {day}
              </div>
            ))}
            
            {/* Calendar cells - make them more compact for mobile */}
            {monthDays.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "p-1 min-h-[40px] text-center rounded-md cursor-pointer flex flex-col items-center justify-start relative pointer-events-auto",
                  getCellColor(day),
                  getPredictedPeriodClass(day)
                )}
              >
                <span className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full text-xs pointer-events-auto",
                  isToday(day) ? "bg-blue-500 text-white" : ""
                )}>
                  {format(day, 'd')}
                </span>
                {getCellContent(day)}
              </div>
            ))}
          </div>
        </div>

        {/* Educational tips */}
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg text-sm">
          <h3 className="font-bold flex items-center">
            <Sun className="h-4 w-4 mr-1" /> 
            Did you know?
          </h3>
          <p>
            Your Follicular Phase can vary in length, but your Luteal Phase is usually 10-14 days! 
            Track consistently to help Uteroo learn your unique rhythm!
          </p>
        </div>

        <div className="flex justify-center mt-6 mb-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 pointer-events-auto"
            onClick={() => toast({
              title: "Cycle Synced!",
              description: "Your Uteroo will now adjust based on your cycle phase.",
              duration: 3000,
            })}
          >
            <Heart className="h-4 w-4 text-red-500" />
            Sync with Uteroo
          </Button>
        </div>
      </ScrollArea>

      {/* Log dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? `Log for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Log your cycle'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Flow</h4>
                <div className="flex space-x-2">
                  <Button
                    variant={flow === "light" ? "default" : "outline"}
                    onClick={() => setFlow("light")}
                    className="flex-1 pointer-events-auto"
                  >
                    Light 💧
                  </Button>
                  <Button
                    variant={flow === "medium" ? "default" : "outline"}
                    onClick={() => setFlow("medium")}
                    className="flex-1 pointer-events-auto"
                  >
                    Medium 💧💧
                  </Button>
                  <Button
                    variant={flow === "heavy" ? "default" : "outline"}
                    onClick={() => setFlow("heavy")}
                    className="flex-1 pointer-events-auto"
                  >
                    Heavy 💧💧💧
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Symptoms</h4>
                <div className="grid grid-cols-2 gap-2">
                  {symptoms.map(symptom => (
                    <Button
                      key={symptom.id}
                      variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
                      onClick={() => toggleSymptom(symptom.id)}
                      className="flex justify-between items-center pointer-events-auto"
                    >
                      <span>{symptom.name}</span>
                      <span>{symptom.emoji}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Mood</h4>
                <div className="flex space-x-2">
                  {moods.map(moodOption => (
                    <Button
                      key={moodOption.id}
                      variant={mood === moodOption.id ? "default" : "outline"}
                      onClick={() => setMood(moodOption.id as "happy" | "sad" | "anxious")}
                      className="flex-1 pointer-events-auto"
                    >
                      {moodOption.name} {moodOption.emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowLogDialog(false)} className="pointer-events-auto">
              Cancel
            </Button>
            <Button onClick={saveLogData} className="pointer-events-auto">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
