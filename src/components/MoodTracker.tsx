import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Mood = {
  emoji: string;
  label: string;
  recommendations: string[];
};

const moods: Record<string, Mood> = {
  great: {
    emoji: "😊",
    label: "Great",
    recommendations: [
      "Keep up the positive energy!",
      "Share your joy with others",
      "Document what made today special"
    ]
  },
  good: {
    emoji: "🙂",
    label: "Good",
    recommendations: [
      "Take a short walk outside",
      "Practice gratitude journaling",
      "Connect with a friend"
    ]
  },
  okay: {
    emoji: "😐",
    label: "Okay",
    recommendations: [
      "Try a 5-minute meditation",
      "Have a calming tea",
      "Listen to your favorite music"
    ]
  },
  tired: {
    emoji: "😴",
    label: "Tired",
    recommendations: [
      "Take a power nap",
      "Do some gentle stretching",
      "Ensure you're staying hydrated"
    ]
  },
  stressed: {
    emoji: "😰",
    label: "Stressed",
    recommendations: [
      "Practice deep breathing",
      "Take a warm bath",
      "Write down your worries"
    ]
  }
};

export const MoodTracker = ({ phase = "menstruation" }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: "Mood logged!",
      description: "Thank you for sharing how you're feeling today.",
    });
  };

  return (
    <Card className={`p-6 bg-${phase}-bg border-0 max-w-md mx-auto`}>
      <div className="space-y-6">
        <h3 className={`text-xl font-medium text-${phase}-primary text-center`}>
          How are you feeling today?
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {Object.entries(moods).map(([key, mood]) => (
            <Button
              key={key}
              onClick={() => handleMoodSelect(key)}
              variant={selectedMood === key ? "default" : "outline"}
              className={`flex flex-col items-center justify-center p-4 min-h-[80px] ${
                selectedMood === key ? `bg-${phase}-primary text-white` : ""
              }`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>

        {selectedMood && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-2">
              {moods[selectedMood].recommendations.map((rec, index) => (
                <li key={index} className="text-gray-600">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};