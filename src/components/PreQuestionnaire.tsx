
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PreQuestionnaireProps {
  onComplete: (username: string, data: any) => void;
}

export const PreQuestionnaire = ({ onComplete }: PreQuestionnaireProps) => {
  const [username, setUsername] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const { toast } = useToast();

  const questions = [
    {
      id: "cycleRegularity",
      title: "How regular is your menstrual cycle?",
      options: [
        { value: "very-regular", label: "Very regular (28-30 days)" },
        { value: "somewhat-regular", label: "Somewhat regular (25-35 days)" },
        { value: "irregular", label: "Irregular (varies significantly)" },
        { value: "no-cycle", label: "I don't get periods/unsure" }
      ]
    },
    {
      id: "currentPhase",
      title: "Where do you think you are in your cycle right now?",
      options: [
        { value: "menstruation", label: "On my period" },
        { value: "follicular", label: "Just after my period" },
        { value: "ovulatory", label: "Around ovulation (mid-cycle)" },
        { value: "luteal", label: "Before my next period" },
        { value: "unsure", label: "I'm not sure" }
      ]
    },
    {
      id: "symptoms",
      title: "What symptoms are you currently experiencing?",
      options: [
        { value: "cramps", label: "Cramps or pelvic pain" },
        { value: "mood-changes", label: "Mood swings or irritability" },
        { value: "fatigue", label: "Fatigue or low energy" },
        { value: "bloating", label: "Bloating or digestive issues" },
        { value: "none", label: "No significant symptoms" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, process the data
      const processedData = {
        cycleRegularity: newAnswers.cycleRegularity,
        cyclePhase: newAnswers.currentPhase === "unsure" ? "follicular" : newAnswers.currentPhase,
        symptoms: newAnswers.symptoms,
        hormoneLevel: determineHormoneLevel(newAnswers)
      };

      console.log('Questionnaire completed:', { username, processedData });
      onComplete(username.trim(), processedData);
    }
  };

  const determineHormoneLevel = (answers: any) => {
    // Simple logic to determine hormone level based on answers
    if (answers.currentPhase === "menstruation") return "low-estrogen";
    if (answers.currentPhase === "follicular") return "rising-estrogen";
    if (answers.currentPhase === "ovulatory") return "high-estrogen";
    if (answers.currentPhase === "luteal") return "high-progesterone";
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
    setCurrentQuestion(0); // Start questionnaire
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Username input screen
  if (currentQuestion === 0 && !answers[questions[0]?.id]) {
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
                Welcome to Uteroo!
              </h1>
              <p className="text-gray-600">
                Let's start by choosing a username and learning about your cycle
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
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
              Continue to Questionnaire
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Questionnaire screens
  const question = questions[currentQuestion];
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm border shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
              alt="Uteroo"
              className="w-20 h-20 object-contain"
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#9370DB]">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-gray-700 font-medium">
              {question.title}
            </p>
          </div>
        </div>

        <RadioGroup onValueChange={handleAnswer} className="space-y-3">
          {question.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {currentQuestion > 0 && (
          <Button
            onClick={goBack}
            variant="outline"
            className="w-full"
          >
            Go Back
          </Button>
        )}

        <div className="flex justify-center">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentQuestion ? 'bg-[#9370DB]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
