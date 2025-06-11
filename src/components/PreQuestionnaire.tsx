
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PreQuestionnaireProps {
  onComplete: (username: string, data: any) => void;
}

export const PreQuestionnaire = ({ onComplete }: PreQuestionnaireProps) => {
  const [username, setUsername] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { toast } = useToast();

  const questions = [
    {
      id: "lastPeriod",
      title: "When did your last period start? 🩸",
      options: [
        { value: "tap-to-select", label: "📅 Tap to select", icon: "📅", requiresDate: true },
        { value: "on-it-now", label: "🔴 I'm on it right now!", icon: "🔴" },
        { value: "havent-gotten", label: "🌱 I haven't gotten my period yet", icon: "🌱" },
        { value: "stopped-getting", label: "🦋 I stopped getting my period", icon: "🦋" },
        { value: "dont-remember", label: "🧡 I don't remember", icon: "🧡" }
      ]
    },
    {
      id: "periodLength",
      title: "How long do your periods usually last? ⏰",
      options: [
        { value: "3-5-days", label: "🩸 3-5 days", icon: "🩸" },
        { value: "6-7-days", label: "💭 6-7 days", icon: "💭" },
        { value: "8-plus-days", label: "⌛ 8+ days", icon: "⌛" },
        { value: "varies-lot", label: "♾️ It varies a lot", icon: "♾️" }
      ]
    },
    {
      id: "cyclePredictability",
      title: "How predictable is your cycle? 🔮",
      options: [
        { value: "like-clockwork", label: "⏰ Like clockwork!", icon: "⏰" },
        { value: "usually-25-35", label: "📅 Usually 25-35 days", icon: "📅" },
        { value: "complete-surprise", label: "🎲 Complete surprise every month", icon: "🎲" }
      ]
    },
    {
      id: "ovulationSigns",
      title: "Do you notice any signs around ovulation? 🥚",
      options: [
        { value: "egg-white-discharge", label: "🥚 Egg-white discharge", icon: "🥚" },
        { value: "energy-boost", label: "⚡ Energy boost", icon: "⚡" },
        { value: "mood-changes", label: "😊 Mood changes", icon: "😊" },
        { value: "no-signs", label: "🚫 No signs", icon: "🚫" }
      ]
    },
    {
      id: "premenstrualFeel",
      title: "How do you feel 5-7 days before your period? 💭",
      options: [
        { value: "irritable-sensitive", label: "⚠️ Irritable/sensitive", icon: "⚠️" },
        { value: "bloated-craving", label: "🍫 Bloated/craving carbs", icon: "🍫" },
        { value: "breast-tenderness", label: "🤱 Breast tenderness", icon: "🤱" },
        { value: "totally-fine", label: "🚀 Totally fine, no changes!", icon: "🚀" }
      ]
    },
    {
      id: "annoyingSymptom",
      title: "What's your most annoying symptom? 😤",
      options: [
        { value: "cramps", label: "😫 Cramps", icon: "😫" },
        { value: "mood-swings", label: "😤 Mood swings", icon: "😤" },
        { value: "fatigue", label: "😴 Fatigue", icon: "😴" },
        { value: "bloating", label: "🎈 Bloating", icon: "🎈" },
        { value: "headaches", label: "🤕 Headaches", icon: "🤕" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const currentQ = questions[currentQuestion];
    
    // If this is the date selection question and they chose "tap-to-select"
    if (currentQ.id === "lastPeriod" && value === "tap-to-select") {
      setShowDatePicker(true);
      return;
    }

    const newAnswers = { 
      ...answers, 
      [currentQ.id]: value,
      // Add selected date if it exists
      ...(selectedDate && currentQ.id === "lastPeriod" && { lastPeriodDate: selectedDate })
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, process the data
      const processedData = {
        lastPeriod: newAnswers.lastPeriod,
        lastPeriodDate: newAnswers.lastPeriodDate,
        periodLength: newAnswers.periodLength,
        cyclePredictability: newAnswers.cyclePredictability,
        ovulationSigns: newAnswers.ovulationSigns,
        premenstrualFeel: newAnswers.premenstrualFeel,
        annoyingSymptom: newAnswers.annoyingSymptom,
        cyclePhase: determineCyclePhase(newAnswers),
        hormoneLevel: determineHormoneLevel(newAnswers)
      };

      console.log('Questionnaire completed:', { username, processedData });
      onComplete(username.trim(), processedData);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowDatePicker(false);
      
      const newAnswers = { 
        ...answers, 
        lastPeriod: "tap-to-select",
        lastPeriodDate: date
      };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const processedData = {
          lastPeriod: newAnswers.lastPeriod,
          lastPeriodDate: newAnswers.lastPeriodDate,
          periodLength: newAnswers.periodLength,
          cyclePredictability: newAnswers.cyclePredictability,
          ovulationSigns: newAnswers.ovulationSigns,
          premenstrualFeel: newAnswers.premenstrualFeel,
          annoyingSymptom: newAnswers.annoyingSymptom,
          cyclePhase: determineCyclePhase(newAnswers),
          hormoneLevel: determineHormoneLevel(newAnswers)
        };

        console.log('Questionnaire completed:', { username, processedData });
        onComplete(username.trim(), processedData);
      }
    }
  };

  const determineCyclePhase = (answers: any) => {
    if (answers.lastPeriod === "on-it-now") return "menstruation";
    if (answers.ovulationSigns === "egg-white-discharge" || answers.ovulationSigns === "energy-boost") return "ovulatory";
    if (answers.premenstrualFeel === "irritable-sensitive" || answers.premenstrualFeel === "bloated-craving") return "luteal";
    return "follicular"; // default
  };

  const determineHormoneLevel = (answers: any) => {
    if (answers.lastPeriod === "on-it-now") return "low-estrogen";
    if (answers.ovulationSigns === "egg-white-discharge") return "high-estrogen";
    if (answers.premenstrualFeel === "irritable-sensitive") return "high-progesterone";
    return "balanced"; // default
  };

  const handleSubmit = () => {
    if (!username.trim()) {
      toast({
        title: "Please enter a username",
        description: "Choose a username to continue",
        variant: "destructive",
      });
      return;
    }
    console.log('Starting questionnaire with username:', username);
    setShowQuestionnaire(true);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setShowQuestionnaire(false);
    }
  };

  const getHeartCount = () => {
    const baseCounts = [0, 10, 15, 20, 25, 35];
    return baseCounts[currentQuestion] || 0;
  };

  // Username input screen
  if (!showQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm border shadow-lg">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
                alt="Uteroo Welcome"
                className="w-24 h-24 object-contain animate-bounce"
              />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#9370DB]">
                Welcome to Uteroo! 🌸
              </h1>
              <p className="text-gray-600">
                Let's start by choosing a username and learning about your cycle ✨
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username 👤
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="text-center text-lg font-medium"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!username.trim()}
              className="w-full bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full py-3 text-lg font-medium"
            >
              Continue to Questionnaire 🚀
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Date picker overlay
  if (showDatePicker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm border shadow-lg">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-pink-400">
              📅 When did your last period start?
            </h2>
            <p className="text-gray-600">Select the date below</p>
          </div>

          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              className="rounded-md border"
            />
          </div>

          <Button
            onClick={() => setShowDatePicker(false)}
            variant="outline"
            className="w-full rounded-full"
          >
            Cancel
          </Button>
        </Card>
      </div>
    );
  }

  // Questionnaire screens
  const question = questions[currentQuestion];
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm border shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="text-sm text-gray-500">
            Screen {currentQuestion + 1} of {questions.length}
          </div>
          <div className="flex items-center gap-1 text-pink-500">
            <span>💗</span>
            <span className="text-sm font-medium">{getHeartCount()}</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-pink-400">
              Question {currentQuestion + 1} of {questions.length} ✨
            </h2>
            <p className="text-sm text-gray-500 italic">
              Let's get to know your cycle better 🌸
            </p>
            <h3 className="text-lg font-semibold text-gray-800">
              {question.title}
            </h3>
          </div>
        </div>

        <RadioGroup onValueChange={handleAnswer} className="space-y-3">
          {question.options.map((option) => (
            <div 
              key={option.value} 
              className={`flex items-center space-x-3 p-4 rounded-full border-2 hover:bg-purple-50 cursor-pointer transition-colors ${
                answers[question.id] === option.value ? 'bg-purple-100 border-purple-300' : 'border-gray-200'
              }`}
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selectedDate && question.id === "lastPeriod" && (
          <div className="text-center p-3 bg-pink-50 rounded-lg">
            <p className="text-sm text-pink-600">
              📅 Selected: {format(selectedDate, "PPP")}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={goBack}
            variant="outline"
            className="flex-1 rounded-full"
          >
            {currentQuestion === 0 ? "Back" : "Previous"}
          </Button>
          
          {currentQuestion === questions.length - 1 && answers[question.id] && (
            <Button
              onClick={() => handleAnswer(answers[question.id])}
              className="flex-1 bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full"
            >
              Get My Results 🎉
            </Button>
          )}
          
          {currentQuestion < questions.length - 1 && answers[question.id] && (
            <Button
              onClick={() => handleAnswer(answers[question.id])}
              className="flex-1 bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full"
            >
              Next ➡️
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
