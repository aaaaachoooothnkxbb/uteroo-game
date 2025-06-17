import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Heart, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

type FormData = {
  height: string;
  weight: string;
  hydration: string;
  nutrition: string;
  protein: string;
  movement: string;
  sleep: number;
  sleepBarriers: string[];
  screenTime: string;
};

type UserType = 'PRE_MENSTRUAL' | 'MENSTRUAL' | 'POST_MENSTRUAL';

// ... keep existing code (questions array)
const questions = [
  {
    id: "height",
    title: "To help us tailor your Uteroo journey, how tall are you?",
    type: "input",
    unit: "cm",
    insight: "Understanding your body helps us provide personalized guidance!"
  },
  {
    id: "weight",
    title: "What is your current weight?",
    type: "input", 
    unit: "kg",
    insight: "This helps us understand your unique needs!"
  },
  {
    id: "hydration",
    title: "Hydration is key for feeling great! On average, how much water do you drink each day?",
    type: "radio",
    options: [
      { value: "less-than-1", label: "Less than 1 liter (less than ~4 glasses)" },
      { value: "1-2", label: "1-2 liters (~4-8 glasses)" },
      { value: "2-3", label: "2-3 liters (~8-12 glasses)" },
      { value: "more-than-3", label: "More than 3 liters (more than ~12 glasses)" }
    ],
    insight: "Staying hydrated helps every part of your body work smoothly!"
  },
  {
    id: "nutrition",
    title: "Thinking about your typical meals, how balanced do you think your plate is?",
    type: "radio",
    options: [
      { value: "very-balanced", label: "My plate often looks very balanced, like the guide (lots of fruits/veggies, healthy protein/grains)" },
      { value: "somewhat-balanced", label: "I try to balance, but sometimes I lean more heavily on grains or protein, or less on fruits/veggies" },
      { value: "not-balanced", label: "My plate often looks quite different from this guide (e.g., lots of processed foods, less variety)" }
    ],
    insight: "The right fuel helps you feel energized and strong!"
  },
  {
    id: "protein",
    title: "When you choose protein (like lean meats, fish, beans, lentils, or tofu), do you get enough of these 'building blocks' most often?",
    type: "radio",
    options: [
      { value: "yes-often", label: "Yes, often" },
      { value: "sometimes", label: "Sometimes" },
      { value: "not-really", label: "Not really" }
    ],
    insight: "Protein helps your body grow strong and repair itself!"
  },
  {
    id: "movement",
    title: "Movement helps you feel your best! How do you typically move your body each week?",
    type: "radio",
    options: [
      { value: "sedentary", label: "Sedentary (mostly sitting/standing)" },
      { value: "light", label: "Light activity (gentle walks, chores)" },
      { value: "moderate", label: "Moderate activity (brisk walking, cycling, dancing)" },
      { value: "regular", label: "Regular exercise (3-5 times/week, e.g., sports, gym)" },
      { value: "intense", label: "Intense exercise (daily, high-intensity workouts)" }
    ],
    insight: "Moving your body is a great way to boost your mood and energy!"
  },
  {
    id: "sleep",
    title: "Good sleep is super important for growth and feeling refreshed! On average, how many hours do you sleep per night?",
    type: "slider",
    min: 4,
    max: 12,
    insight: "Enough sleep helps your body recharge and be ready for anything!"
  },
  {
    id: "sleepBarriers",
    title: "Sometimes things can make it hard to get enough sleep. What usually gets in the way? (Select all that apply)",
    type: "checkbox",
    options: [
      { value: "stress", label: "Feeling worried or stressed" },
      { value: "screen-time", label: "Too much screen time before bed (phone, tablet)" },
      { value: "discomfort", label: "Not feeling comfortable (e.g., body aches, tummy trouble)" },
      { value: "inconsistent-bedtime", label: "Going to bed at different times each night" },
      { value: "noise-light", label: "Too much noise or light where I sleep" },
      { value: "other", label: "Other" }
    ],
    insight: "Understanding what makes sleep tricky helps us find solutions together!"
  },
  {
    id: "screenTime",
    title: "How many hours a day do you typically spend looking at screens (phone, computer, TV) outside of school/homework?",
    type: "radio",
    options: [
      { value: "less-than-2", label: "Less than 2 hours" },
      { value: "2-4", label: "2-4 hours" },
      { value: "4-6", label: "4-6 hours" },
      { value: "6-plus", label: "6+ hours" }
    ],
    insight: "Balancing screen time with other activities can help your eyes and your mind feel better!"
  },
  // Add new classification questions
  {
    id: "menstrualStatus",
    title: "To provide the most relevant guidance, which best describes your current situation?",
    type: "radio",
    options: [
      { value: "pre-menstrual", label: "I haven't started menstruating yet" },
      { value: "menstrual", label: "I currently menstruate" },
      { value: "post-menstrual", label: "I used to menstruate but no longer do (menopause, etc.)" }
    ],
    insight: "This helps us tailor your experience to your unique needs!"
  }
];

const PrePeriodGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    height: "",
    weight: "",
    hydration: "",
    nutrition: "",
    protein: "",
    movement: "",
    sleep: 8,
    sleepBarriers: [],
    screenTime: ""
  });
  const [menstrualStatus, setMenstrualStatus] = useState<string>("");
  const [heartPoints, setHeartPoints] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const classifyUserType = (status: string): UserType => {
    switch (status) {
      case 'pre-menstrual':
        return 'PRE_MENSTRUAL';
      case 'menstrual':
        return 'MENSTRUAL';
      case 'post-menstrual':
        return 'POST_MENSTRUAL';
      default:
        return 'MENSTRUAL'; // Default fallback
    }
  };

  const saveUserType = async (userType: UserType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_types')
        .upsert({
          user_id: user.id,
          user_type: userType,
          classification_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error saving user type:', error);
      }
    } catch (error) {
      console.error('Error saving user type:', error);
    }
  };

  const saveQuestionnaireResponse = async (questionId: string, value: string | string[] | number, userType: UserType) => {
    if (!user) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    try {
      const responses = [];
      
      if (Array.isArray(value)) {
        // Handle checkbox responses
        for (const item of value) {
          responses.push({
            user_id: user.id,
            questionnaire_type: 'pre_period_game',
            question_id: questionId,
            question_text: question.title,
            answer_value: item,
            answer_type: question.type,
            user_type: userType
          });
        }
      } else {
        responses.push({
          user_id: user.id,
          questionnaire_type: 'pre_period_game',
          question_id: questionId,
          question_text: question.title,
          answer_value: value.toString(),
          answer_type: question.type,
          user_type: userType
        });
      }

      const { error } = await supabase
        .from('questionnaire_responses')
        .insert(responses);

      if (error) {
        console.error('Error saving questionnaire response:', error);
      }
    } catch (error) {
      console.error('Error saving questionnaire response:', error);
    }
  };

  const initializeCycleTracking = async () => {
    if (!user) return;

    try {
      // Check if cycle tracking already exists
      const { data: existingTracking } = await supabase
        .from('cycle_tracking')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingTracking) {
        // Create initial cycle tracking entry
        const { error } = await supabase
          .from('cycle_tracking')
          .insert({
            user_id: user.id,
            cycle_start_date: new Date().toISOString().split('T')[0],
            cycle_length: 28,
            period_length: 5
          });

        if (error) {
          console.error('Error initializing cycle tracking:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing cycle tracking:', error);
    }
  };

  const savePrePeriodData = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mood_logs')
        .insert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          mood: 'learning',
          symptoms: [],
          notes: `Pre-period questionnaire completed: Height: ${formData.height}cm, Weight: ${formData.weight}kg, Hydration: ${formData.hydration}, Nutrition: ${formData.nutrition}, Movement: ${formData.movement}, Sleep: ${formData.sleep}h, Screen time: ${formData.screenTime}`
        });

      if (error) {
        console.error('Error saving pre-period data:', error);
      }
    } catch (error) {
      console.error('Error saving pre-period data:', error);
    }
  };

  const handleAnswer = async (value: string | string[] | number) => {
    const question = questions[currentQuestion];
    const newFormData = { ...formData };
    
    // Handle different question types
    if (question.id === "menstrualStatus") {
      setMenstrualStatus(value as string);
    } else if (question.type === "checkbox") {
      newFormData.sleepBarriers = value as string[];
    } else if (question.type === "slider") {
      newFormData.sleep = value as number;
    } else {
      (newFormData as any)[question.id] = value;
    }
    
    setFormData(newFormData);
    setHeartPoints(prev => prev + 10);
    
    toast({
      title: "Great choice!",
      description: questions[currentQuestion].insight,
    });
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        handleComplete();
      }
    }, 1000);
  };

  const handleComplete = async () => {
    if (!user) return;

    // Determine user type
    const userType = classifyUserType(menstrualStatus);
    
    // Save user type
    await saveUserType(userType);
    
    // Save all questionnaire responses
    for (const [key, value] of Object.entries(formData)) {
      if (value !== "" && value !== 0 && !(Array.isArray(value) && value.length === 0)) {
        await saveQuestionnaireResponse(key, value, userType);
      }
    }
    
    // Save menstrual status response
    if (menstrualStatus) {
      await saveQuestionnaireResponse('menstrualStatus', menstrualStatus, userType);
    }
    
    // Initialize cycle tracking for MENSTRUAL users
    if (userType === 'MENSTRUAL') {
      await initializeCycleTracking();
    }
    
    // Save legacy mood log data
    await savePrePeriodData();
    
    toast({
      title: "Amazing work! 🌱",
      description: "You've built a strong foundation! Now let's meet your companion.",
      duration: 5000,
    });
    
    navigate("/pou-game");
  };

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 space-y-6 bg-white/90 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <img
              src="/lovable-uploads/f135b894-cd85-4010-a103-0fc5cb07ea0d.png"
              alt="Uteroo Character"
              className="w-64 h-64 mx-auto animate-bounce-slow"
            />
            <h1 className="text-3xl font-bold text-[#9370DB]">
              Uteroo's Self-Care Compass ✨
            </h1>
            <div className="text-left space-y-4 text-gray-700 leading-relaxed">
              <p>Think of your body like a beautiful, unique living system. To truly thrive and feel your best, we don't just focus on how things look on the outside. We believe in <strong>true self-care</strong>, which means understanding what your body needs from the inside out to grow strong and vibrant!</p>
              
              {/* Animated Plant Growth Visual */}
              <div className="flex items-center justify-center py-6 space-x-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-green-200">
                <div className="text-4xl animate-bounce">💧</div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="text-6xl animate-pulse">🪻</div>
                  <div className="text-sm text-green-600 font-medium animate-pulse">You flourishing!</div>
                </div>
                <div className="text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
              </div>
              
              <p>Here at Uteroo, we'll help you discover what makes <em>your</em> unique system flourish. Let's start by understanding your daily habits!</p>
            </div>
            <Button
              onClick={() => setShowIntro(false)}
              className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 py-3 rounded-full text-lg"
            >
              Let's Start! 🌱
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6 bg-white/90 backdrop-blur-sm">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <Progress value={progress} className="flex-1 mx-4" />
          <div className="flex items-center gap-1 text-[#FF69B4] font-bold">
            <Heart fill="#FF69B4" size={20} />
            <span>{heartPoints}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#9370DB] mb-4 flex items-center justify-center gap-2">
              {question.title}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-[#9370DB] cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{question.insight}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h2>
          </div>

          {/* Input Questions */}
          {question.type === "input" && (
            <div className="flex items-center gap-4 justify-center">
              <Input
                type="number"
                placeholder="Enter value"
                value={formData[question.id as keyof FormData] as string}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="w-32 text-center"
              />
              <span className="text-gray-600">{question.unit}</span>
              <Button
                onClick={() => handleAnswer(formData[question.id as keyof FormData] as string)}
                disabled={!formData[question.id as keyof FormData]}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white"
              >
                Next
              </Button>
            </div>
          )}

          {/* Radio Questions */}
          {question.type === "radio" && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  variant="outline"
                  className="w-full text-left h-auto py-4 px-6 rounded-full hover:bg-pink-50 hover:border-[#9370DB] focus:bg-pink-50 focus:border-[#9370DB] transition-all duration-200 text-black text-wrap"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}

          {/* Slider Questions */}
          {question.type === "slider" && (
            <div className="space-y-6">
              <div className="px-6">
                <Slider
                  value={[formData.sleep]}
                  onValueChange={(value) => setFormData({ ...formData, sleep: value[0] })}
                  min={question.min}
                  max={question.max}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{question.min} hours</span>
                  <span className="font-bold text-[#9370DB]">{formData.sleep} hours</span>
                  <span>{question.max} hours</span>
                </div>
              </div>
              <Button
                onClick={() => handleAnswer(formData.sleep)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white mx-auto block"
              >
                Next
              </Button>
            </div>
          )}

          {/* Checkbox Questions */}
          {question.type === "checkbox" && question.options && (
            <div className="space-y-4">
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                  <Checkbox
                    id={option.value}
                    checked={formData.sleepBarriers.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newBarriers = checked
                        ? [...formData.sleepBarriers, option.value]
                        : formData.sleepBarriers.filter(b => b !== option.value);
                      setFormData({ ...formData, sleepBarriers: newBarriers });
                    }}
                  />
                  <label htmlFor={option.value} className="text-gray-700 cursor-pointer flex-1">
                    {option.label}
                  </label>
                </div>
              ))}
              <Button
                onClick={() => handleAnswer(formData.sleepBarriers)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white mt-4"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PrePeriodGame;
