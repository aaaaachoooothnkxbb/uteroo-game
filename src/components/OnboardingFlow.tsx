import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { Heart, Calendar, Info, Copy } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

type FormOption = {
  value: string;
  label: string;
  icon?: string;
  recommendation: string;
  tooltip?: string;
};

const formOptions: Record<string, FormOption[]> = {
  lastPeriodStart: [
    {
      value: "calendar",
      label: "Tap to select",
      icon: "📅",
      recommendation: "Thanks for sharing your cycle date! This helps us provide more accurate predictions for your future cycles.",
      tooltip: "Knowing when your period started helps us calculate which hormonal phase you're in right now."
    },
    {
      value: "current",
      label: "I'm on it right now!",
      icon: "🩸",
      recommendation: "Since you're currently on your period, your estrogen levels are at their lowest. This is why you might be feeling tired or having mood fluctuations. Taking it easy and practicing self-care is important right now.",
      tooltip: "During menstruation, both estrogen and progesterone are at their lowest, which can cause fatigue and mood changes."
    },
    {
      value: "unknown",
      label: "I don't remember - remind me next time",
      icon: "🤷",
      recommendation: "No problem! We'll remind you to track your next period. For now, we'll use general recommendations based on other answers you provide.",
      tooltip: "You can always update this later when you remember or when your next period starts."
    }
  ],
  periodLength: [
    {
      value: "3-5",
      label: "3-5 days",
      recommendation: "A 3-5 day period is common for many people. During this time, your uterine lining sheds as estrogen levels begin to rise again.",
      tooltip: "About 70% of people have periods lasting 3-5 days. This is considered the typical duration."
    },
    {
      value: "6-7",
      label: "6-7 days",
      recommendation: "Having a 6-7 day period is perfectly normal. Your body might take a bit longer to shed the uterine lining, which can sometimes mean slightly different hormonal patterns.",
      tooltip: "Longer periods can sometimes indicate thicker uterine lining or slower shedding processes."
    },
    {
      value: "8+",
      label: "8+ days",
      recommendation: "Periods lasting 8+ days can sometimes indicate hormonal fluctuations. If you experience very heavy bleeding or severe symptoms, consider checking with a healthcare provider.",
      tooltip: "While longer periods can be normal for some, they can sometimes be related to conditions like PCOS or endometriosis."
    },
    {
      value: "varies",
      label: "It varies a lot",
      icon: "♾️",
      recommendation: "Having variable period lengths is actually quite common! Factors like stress, sleep, diet, and exercise can all influence your cycle length.",
      tooltip: "Variation in period length is normal and can be influenced by lifestyle factors, stress, and hormonal changes."
    }
  ],
  cyclePredictability: [
    {
      value: "clockwork",
      label: "Like clockwork!",
      icon: "⏱️",
      recommendation: "Having a predictable cycle makes tracking easier! Your hormones likely follow a fairly consistent pattern, which can help you plan activities around your cycle phases.",
      tooltip: "Regular cycles often indicate balanced hormones and can make predicting future periods more accurate."
    },
    {
      value: "regular-varies",
      label: "Usually 25-35 days",
      icon: "🔄",
      recommendation: "Your cycle has some variability, which is completely normal! This slight variation can be due to factors like stress, travel, or even changes in your diet.",
      tooltip: "Variation of a few days is normal and considered a healthy cycle pattern."
    },
    {
      value: "irregular",
      label: "Complete surprise every month",
      icon: "🌪️",
      recommendation: "Irregular cycles are more common than you might think. Factors like stress, PCOS, thyroid conditions, and even intensive exercise can all affect cycle regularity.",
      tooltip: "Unpredictable cycles can make planning difficult, but tracking symptoms can still help identify patterns."
    }
  ],
  ovulationSigns: [
    {
      value: "discharge",
      label: "Egg-white discharge",
      icon: "🥚",
      recommendation: "That egg-white discharge is cervical mucus, which becomes more stretchy and clear during ovulation to help sperm travel to the egg. It's a great natural fertility sign!",
      tooltip: "This stretchy discharge is produced due to rising estrogen levels around ovulation."
    },
    {
      value: "energy",
      label: "Energy boost",
      icon: "⚡",
      recommendation: "That energy surge is common during the follicular phase as estrogen rises! Many people feel more social, creative, and energetic around ovulation.",
      tooltip: "Higher estrogen levels can boost serotonin and dopamine, giving you more energy and improved mood."
    },
    {
      value: "none",
      label: "No signs",
      icon: "🚫",
      recommendation: "Not everyone notices ovulation signs, and that's completely normal! Some people experience subtle changes that they might not connect to their cycle.",
      tooltip: "Ovulation can sometimes happen with minimal noticeable symptoms."
    }
  ],
  premenstrualSymptoms: [
    {
      value: "irritable",
      label: "Irritable/sensitive",
      icon: "🌋",
      recommendation: "Feeling irritable before your period is linked to progesterone peaking and then dropping, which affects serotonin levels. You're definitely not alone in feeling this way!",
      tooltip: "About 75% of menstruating people experience some form of emotional changes before their period."
    },
    {
      value: "bloated",
      label: "Bloated/craving carbs",
      icon: "🥨",
      recommendation: "Bloating and carb cravings happen when progesterone rises! Your body retains more water, and serotonin dips can trigger cravings for comfort foods that boost mood.",
      tooltip: "Carb cravings are your body's way of trying to increase serotonin when levels naturally drop before your period."
    },
    {
      value: "fine",
      label: "Totally fine, no changes!",
      icon: "🌈",
      recommendation: "Lucky you! Some people don't experience significant PMS symptoms. This could be due to more stable hormonal transitions or how your body processes these hormones.",
      tooltip: "About 20-30% of people report minimal PMS symptoms - it can be related to genetics and hormone sensitivity."
    }
  ],
  worstSymptom: [
    {
      value: "cramps",
      label: "Cramps",
      icon: "🤕",
      recommendation: "Cramps happen when your uterus contracts to shed its lining. Heat, gentle movement, and foods rich in magnesium and omega-3s can help ease the discomfort.",
      tooltip: "Prostaglandins cause uterine contractions, which can result in pain. Anti-inflammatory foods can help reduce their production."
    },
    {
      value: "mood",
      label: "Mood swings",
      icon: "😤",
      recommendation: "Mood swings are caused by fluctuating hormones affecting neurotransmitters like serotonin. Mindfulness practices and regular exercise can help stabilize your mood.",
      tooltip: "Estrogen and progesterone influence brain chemicals that regulate mood - these fluctuations are real physiological changes!"
    },
    {
      value: "fatigue",
      label: "Fatigue",
      icon: "🥱",
      recommendation: "Period fatigue can be related to iron loss during menstruation or hormonal shifts. Foods rich in iron, vitamin B12, and staying hydrated can help boost your energy.",
      tooltip: "Blood loss can lead to lower iron levels, and hormonal changes can affect your sleep quality and energy levels."
    }
  ]
};

const QuestionGroups = [
  ["lastPeriodStart", "periodLength"],
  ["cyclePredictability", "ovulationSigns"],
  ["premenstrualSymptoms", "worstSymptom"]
];

// Screen rewards configuration
const screenRewards = [
  { points: 10, message: "Great start! +10 ❤️ added to your profile." },
  { points: 15, message: "You've unlocked Cycle Tracker Tooltip! +15 ❤️ added to your profile." },
  { points: 20, message: "You're a cycle pro! Here's your first booster 🎁 +20 ❤️ added to your profile." }
];

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [questionsScreen, setQuestionsScreen] = useState(0);
  const [formData, setFormData] = useState({
    lastPeriodStart: "",
    periodLength: "",
    cyclePredictability: "",
    ovulationSigns: "",
    premenstrualSymptoms: "",
    worstSymptom: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [heartPoints, setHeartPoints] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<{id: number, top: number, left: number}[]>([]);
  const { toast } = useToast();
  const [nextHeartId, setNextHeartId] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Save onboarding data to Supabase
  const saveOnboardingData = async () => {
    if (!user) {
      console.error('No user found when trying to save onboarding data');
      return;
    }

    try {
      console.log('Saving onboarding data for user:', user.id);
      
      // Prepare cycle tracking data
      const cycleData: any = {
        user_id: user.id,
        cycle_start_date: selectedDate || new Date(),
      };

      // Map period length to numeric values
      const periodLengthMap: Record<string, number> = {
        "3-5": 4,
        "6-7": 6,
        "8+": 8,
        "varies": 7
      };

      if (formData.periodLength && periodLengthMap[formData.periodLength]) {
        cycleData.period_length = periodLengthMap[formData.periodLength];
      }

      // Map cycle predictability to cycle length
      const cycleLengthMap: Record<string, number> = {
        "clockwork": 28,
        "regular-varies": 30,
        "irregular": 32
      };

      if (formData.cyclePredictability && cycleLengthMap[formData.cyclePredictability]) {
        cycleData.cycle_length = cycleLengthMap[formData.cyclePredictability];
      }

      // Save cycle tracking data
      const { error: cycleError } = await supabase
        .from('cycle_tracking')
        .insert(cycleData);

      if (cycleError) {
        console.error('Error saving cycle data:', cycleError);
      } else {
        console.log('Cycle data saved successfully');
      }

      // Prepare mood log data
      const symptoms = [];
      if (formData.premenstrualSymptoms) symptoms.push(formData.premenstrualSymptoms);
      if (formData.worstSymptom) symptoms.push(formData.worstSymptom);
      if (formData.ovulationSigns) symptoms.push(formData.ovulationSigns);

      const moodData = {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        mood: formData.premenstrualSymptoms || 'fine',
        symptoms: symptoms,
        notes: `Onboarding data: Period start: ${formData.lastPeriodStart}, Length: ${formData.periodLength}, Predictability: ${formData.cyclePredictability}`
      };

      // Save mood log data
      const { error: moodError } = await supabase
        .from('mood_logs')
        .insert(moodData);

      if (moodError) {
        console.error('Error saving mood data:', moodError);
      } else {
        console.log('Mood data saved successfully');
      }

      console.log('All onboarding data saved successfully');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const determineGameScreen = () => {
    // Always go to pou-game first for naming the companion
    return "/pou-game";
  };

  const generateSummary = () => {
    // Determine phase based on period start
    let phase = "";
    let phaseInfo = "";
    let phaseEmoji = "";
    let phaseColor = "";
    let daysUntilNextPeriod = "";
    
    if (formData.lastPeriodStart === "current") {
      phase = "menstrual phase";
      phaseInfo = "your body is resetting! Estrogen and progesterone are at their lowest. Rest is your superpower right now. 💤";
      phaseEmoji = "🌑";
      phaseColor = "text-[#FF69B4]";
    } else if (formData.lastPeriodStart === "calendar" && selectedDate) {
      // Calculate days since period started
      const today = new Date();
      const daysSince = Math.floor((today.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine the phase and relevant information
      if (daysSince <= 5) {
        phase = "menstrual phase";
        phaseInfo = "your body is resetting! Estrogen and progesterone are at their lowest. Rest is your superpower right now. 💤";
        phaseEmoji = "🌑";
        phaseColor = "text-[#FF69B4]";
      } else if (daysSince <= 14) {
        phase = "follicular phase";
        phaseInfo = "energy and creativity are peaking. Perfect time for new projects or workouts!";
        phaseEmoji = "🌱";
        phaseColor = "text-[#9370DB]";
      } else if (daysSince <= 17) {
        phase = "ovulatory phase";
        phaseInfo = "testosterone and estrogen are high—you might feel extra confident or social. Baby-making or not, this is your glow phase.";
        phaseEmoji = "🌕";
        phaseColor = "text-yellow-500";
      } else {
        phase = "luteal phase";
        phaseInfo = "progesterone is running the show now. Bloating, mood swings, or cravings? Totally normal! Your body preps for either pregnancy or a fresh cycle.";
        phaseEmoji = "🌗";
        phaseColor = "text-[#8A2BE2]";
        
        // Calculate days until next period (assuming 28-day cycle)
        const cycleDays = formData.cyclePredictability === "clockwork" ? 28 : 
                         formData.cyclePredictability === "regular-varies" ? 30 : 32;
        const daysLeft = cycleDays - daysSince;
        if (daysLeft > 0) {
          daysUntilNextPeriod = `Your next period may start in ~${daysLeft} days.`;
        }
      }
    } else {
      // Default if we can't determine
      phase = "unique cycle pattern";
      phaseInfo = "your cycle plays by its own rules! Tracking symptoms (like cramps or mood) will help us predict your phases better. No stress—we'll learn together. 🌈";
      phaseEmoji = "🌈";
      phaseColor = "text-[#9370DB]";
    }

    // Get nutrient/symptom insights based on worst symptom
    let symptomAdvice = "";
    let boosterSuggestion = "";
    
    if (formData.worstSymptom === "cramps") {
      symptomAdvice = "Magnesium could be your bestie! Try leafy greens, nuts, or a warm Epsom salt bath to ease muscles. 🛁";
      boosterSuggestion = "Unlock the Heat Pack booster in your Bedroom to soothe cramps. Cost: 15 ❤️";
    } else if (formData.worstSymptom === "mood") {
      symptomAdvice = "Your serotonin might need love! Omega-3s (salmon, flaxseeds) and vitamin B6 (bananas, chickpeas) can help stabilize moods. 🧠";
      boosterSuggestion = "Try the Mindfulness Room booster to help balance your emotions. Cost: 10 ❤️";
    } else if (formData.worstSymptom === "fatigue") {
      symptomAdvice = "Focus on iron-rich foods like spinach, lentils, and lean meats to boost your energy. B vitamins from whole grains can help too! ⚡";
      boosterSuggestion = "The Energy Boost booster might be perfect right now. Cost: 15 ❤️";
    }
    
    // Check for bloating in premenstrual symptoms
    if (formData.premenstrualSymptoms === "bloated") {
      if (symptomAdvice) symptomAdvice += " ";
      symptomAdvice += "Hydration + potassium (avocados, sweet potatoes) fight water retention. Psst—your Bathroom boosters are primed for this! 💧";
      if (!boosterSuggestion) boosterSuggestion = "Try the Anti-Bloat Bathroom booster for relief! Cost: 20 ❤️";
    }

    const summary = `
You're likely in your ${phaseEmoji} <span class="${phaseColor} font-bold">**${phase}**</span> — ${phaseInfo}

${symptomAdvice || "Keep tracking your symptoms daily to get more personalized advice!"}

${boosterSuggestion || "Keep earning hearts to unlock personalized boosters for your cycle!"}

${daysUntilNextPeriod}

Remember: Your cycle isn't a flaw—it's a rhythm. Uteroo's here to help you sync with it. Track daily to unlock even smarter tips! 🌸
    `;

    return summary;
  };

  const handleOptionSelect = (field: string, option: FormOption) => {
    if (field === "lastPeriodStart" && option.value === "calendar") {
      // Just open the calendar, don't set the value yet
      return;
    }
    
    setFormData({ ...formData, [field]: option.value });
    
    // Create a floating heart
    const randomLeft = 50 + (Math.random() * 30 - 15); // Between 35-65% to keep it near the center
    setFloatingHearts(prev => [...prev, {
      id: nextHeartId, 
      top: 70, // Start position 
      left: randomLeft
    }]);
    setNextHeartId(prev => prev + 1);
    
    // Show recommendation toast
    toast({
      title: "Great choice!",
      description: option.recommendation,
    });

    // Auto advance to next screen if both questions on current screen are answered
    const currentGroup = QuestionGroups[questionsScreen];
    const allAnswered = currentGroup.every(field => {
      // Special case for calendar option
      if (field === "lastPeriodStart" && formData[field as keyof typeof formData] === "calendar") {
        return !!selectedDate;
      }
      return formData[field as keyof typeof formData] !== "" || field === field && option.value !== "";
    });
    
    if (allAnswered && questionsScreen < 2) {
      // Wait a moment for the animation to complete
      setTimeout(() => {
        // Award points for completing the screen
        const reward = screenRewards[questionsScreen];
        setHeartPoints(prev => prev + reward.points);
        
        toast({
          title: "Screen completed!",
          description: reward.message,
        });
        
        setQuestionsScreen(prev => prev + 1);
      }, 500);
    }
  };

  // Special handler for calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setFormData({ ...formData, lastPeriodStart: "calendar" });
    
    // Create a floating heart
    const randomLeft = 50 + (Math.random() * 30 - 15);
    setFloatingHearts(prev => [...prev, {
      id: nextHeartId, 
      top: 70,
      left: randomLeft
    }]);
    setNextHeartId(prev => prev + 1);
    
    // Show recommendation
    const option = formOptions.lastPeriodStart.find(o => o.value === "calendar");
    if (option) {
      toast({
        title: "Date selected!",
        description: option.recommendation,
      });
    }
    
    // Check if this completes the screen
    const currentGroup = QuestionGroups[questionsScreen];
    const otherField = currentGroup.find(f => f !== "lastPeriodStart");
    const allAnswered = otherField ? formData[otherField as keyof typeof formData] !== "" : true;
    
    if (allAnswered && questionsScreen < 2) {
      setTimeout(() => {
        // Award points for completing the screen
        const reward = screenRewards[questionsScreen];
        setHeartPoints(prev => prev + reward.points);
        
        toast({
          title: "Screen completed!",
          description: reward.message,
        });
        
        setQuestionsScreen(prev => prev + 1);
      }, 500);
    }
  };

  // Remove floating hearts after animation completes
  useEffect(() => {
    if (floatingHearts.length === 0) return;
    
    const timer = setTimeout(() => {
      setFloatingHearts(prev => prev.slice(1));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [floatingHearts]);

  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(value => value !== "").length;
    return (filledFields / totalFields) * 100;
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (Object.values(formData).some(value => value === "")) {
        toast({
          title: "Please answer all questions",
          description: "We need this information to personalize your experience",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Completing onboarding flow...');
      
      // Save data to Supabase before navigation
      await saveOnboardingData();
      
      const summary = generateSummary();
      toast({
        title: "Welcome to Uteroo!",
        description: "Time to meet your companion and give them a name!",
        duration: 5000,
      });
      
      // Always navigate to pou-game for companion naming
      console.log('Navigating to pou-game for companion naming');
      navigate("/pou-game");
    }
  };

  const handleSkip = () => {
    toast({
      title: "Welcome to Uteroo!",
      description: "You can always complete your profile later in settings.",
    });
    navigate("/dashboard");
  };

  // Function to render the calendar popover for date selection
  const renderCalendarPopover = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={formData.lastPeriodStart === "calendar" ? "default" : "outline"}
            className={`w-full justify-start text-left h-auto py-3 px-4 rounded-full ${
              formData.lastPeriodStart === "calendar" 
                ? "bg-[#9370DB] text-white" 
                : "text-black hover:bg-pink-50"
            }`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {selectedDate 
              ? `Selected: ${format(selectedDate, "PPP")}`
              : formOptions.lastPeriodStart[0].label
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="min-h-screen bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-6 bg-white/90 backdrop-blur-sm border shadow-md relative">
        {/* Floating hearts animation container */}
        {floatingHearts.map(heart => (
          <div 
            key={heart.id}
            className="absolute z-10 pointer-events-none"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              animation: 'float-up 1s ease-out forwards'
            }}
          >
            <div className="flex items-center font-bold text-[#FF69B4]">
              <Heart fill="#FF69B4" className="animate-heart-squish mr-1" size={20} />
              <span>+1</span>
            </div>
          </div>
        ))}

        {step === 3 && (
          <div className="flex items-center mb-2 gap-2">
            <Progress value={calculateProgress()} className="w-full rounded-full" />
            <div className="flex items-center gap-1 text-[#FF69B4] font-bold">
              <Heart fill="#FF69B4" size={16} />
              <span>{heartPoints}</span>
            </div>
          </div>
        )}
        
        {step === 1 ? (
          <div className="text-center space-y-6">
            <img
              src="/lovable-uploads/f135b894-cd85-4010-a103-0fc5cb07ea0d.png"
              alt="Welcome"
              className="w-48 h-auto mx-auto animate-bounce-slow"
            />
            <h1 className="text-2xl font-bold text-black">Hi!</h1>
            <p className="text-lg text-black">
              I'm <span className="text-[#FF69B4] font-bold bg-pink-50 px-2 rounded-full">Uteroo</span> your loyal companion through every twist and turn of your hormonal journey.
            </p>
            <p className="text-gray-700">
              Together, we'll navigate the ups and downs, making sure you feel supported and understood every step of the way
            </p>
            <h2 className="text-xl font-bold text-black">
              Who's up for this journey?
            </h2>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setStep(3)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 rounded-full"
              >
                Me!
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 rounded-full"
              >
                I'm new to this...
              </Button>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center text-black">
              UNDERSTANDING YOUR CYCLE
            </h1>
            <p className="text-lg text-center text-gray-700 mb-8">
              Your hormones, including Estrogen, Progesterone, Luteinizing hormone (LH), and 
              Follicle-stimulating hormone (FSH), play a crucial role in your cycle. They influence 
              your mood, energy, and overall well-being.
            </p>
            <PhaseExplanation />
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setStep(3)}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 rounded-full"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top progress bar with hearts and screen indicator */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 w-full">
                <div className="text-gray-500 text-sm font-medium">
                  Screen {questionsScreen + 1} of 3
                </div>
                <Progress 
                  value={(questionsScreen + 1) / 3 * 100} 
                  className="flex-1 rounded-full"
                />
                <div className="flex items-center gap-1 text-[#FF69B4] font-bold">
                  <Heart fill="#FF69B4" size={20} />
                  <span>{heartPoints}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl text-[#FF69B4] font-bold mb-2">
                Let's Get to Know Your Cycle
              </h2>
              <p className="text-gray-700 italic">
                Your answers help us provide personalized hormonal insights
              </p>
            </div>

            {questionsScreen < 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                {QuestionGroups[questionsScreen].map((field) => (
                  <div key={field} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg text-black">
                        {field === "lastPeriodStart" 
                          ? "When did your last period start?" 
                          : field === "periodLength" 
                          ? "How long do your periods usually last?" 
                          : field === "cyclePredictability" 
                          ? "How predictable is your cycle?" 
                          : field === "ovulationSigns" 
                          ? "Do you notice any signs around ovulation?" 
                          : field === "premenstrualSymptoms" 
                          ? "How do you feel 5-7 days before your period?" 
                          : "What's your most annoying symptom?"}
                      </h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={16} className="text-[#9370DB] cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{formOptions[field][0].tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {field === "lastPeriodStart" && formOptions[field][0].value === "calendar" && (
                        renderCalendarPopover()
                      )}
                      
                      {formOptions[field].map((option, index) => (
                        option.value !== "calendar" && (
                          <Button
                            key={option.value}
                            onClick={() => handleOptionSelect(field, option)}
                            variant={formData[field as keyof typeof formData] === option.value ? "default" : "outline"}
                            className={`w-full justify-start text-left h-auto py-3 px-4 rounded-full ${
                              formData[field as keyof typeof formData] === option.value 
                                ? "bg-[#9370DB] text-white" 
                                : "text-black hover:bg-pink-50"
                            }`}
                          >
                            {option.icon && <span className="mr-2">{option.icon}</span>}
                            {option.label}
                          </Button>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Diagnostic summary screen
              <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl shadow-sm border border-pink-100">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#9370DB]">Your Hormonal Diagnosis</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => {
                        navigator.clipboard.writeText(generateSummary().replace(/<[^>]*>/g, ''));
                        toast({
                          title: "Copied to clipboard",
                          description: "You can share this with your healthcare provider",
                        });
                      }}
                    >
                      <Copy size={14} /> 
                      <span className="text-xs">Copy</span>
                    </Button>
                  </div>
                  
                  <div 
                    className="prose text-left text-gray-700 space-y-3" 
                    dangerouslySetInnerHTML={{ __html: generateSummary() }} 
                  />
                  
                  <div className="mt-6 pt-4 border-t border-pink-100 flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-[#9370DB]">
                            <Info size={14} />
                            <span className="text-xs">Why this phase?</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>This is based on your cycle start date and usual length. Hormones like estrogen and progesterone fluctuate through your cycle, affecting energy, mood, and physical symptoms.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-between mt-8">
              {questionsScreen > 0 && questionsScreen < 3 ? (
                <Button
                  onClick={() => setQuestionsScreen(questionsScreen - 1)}
                  variant="outline"
                  className="text-[#9370DB] hover:bg-pink-50 rounded-full"
                >
                  Back
                </Button>
              ) : (
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="text-[#FF69B4] hover:bg-pink-50 rounded-full"
                >
                  Skip for now
                </Button>
              )}
              
              <Button
                onClick={() => {
                  if (questionsScreen < 2) {
                    // Check if all questions on current screen are answered
                    const currentGroup = QuestionGroups[questionsScreen];
                    const allAnswered = currentGroup.every(field => {
                      if (field === "lastPeriodStart" && formData[field] === "calendar") {
                        return !!selectedDate;
                      }
                      return formData[field as keyof typeof formData] !== "";
                    });
                    
                    if (allAnswered) {
                      // Award points for completing the screen
                      const reward = screenRewards[questionsScreen];
                      setHeartPoints(prev => prev + reward.points);
                      
                      toast({
                        title: "Screen completed!",
                        description: reward.message,
                      });
                      
                      setQuestionsScreen(questionsScreen + 1);
                    } else {
                      toast({
                        title: "Please answer all questions",
                        description: "We need this information to personalize your experience",
                        variant: "destructive",
                      });
                    }
                  } else if (questionsScreen === 2) {
                    // Show diagnostic summary
                    setQuestionsScreen(3);
                    setHeartPoints(prev => prev + 25);
                    
                    toast({
                      title: "Diagnosis complete!",
                      description: "Here's your personalized hormonal insights! +25 ❤️",
                    });
                  } else {
                    // Submit and navigate to game screen
                    console.log('Continue to Game button clicked');
                    handleNext();
                  }
                }}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full"
                disabled={questionsScreen === 3 && Object.values(formData).some(value => value === "")}
              >
                {questionsScreen === 3 ? "Continue to Game" : questionsScreen === 2 ? "Get My Diagnosis" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
