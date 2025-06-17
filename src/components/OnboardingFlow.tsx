import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PhaseExplanation } from "@/components/PhaseExplanation";
import { Heart, Calendar, Info, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
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
      value: "no-period-yet",
      label: "I haven't gotten my period yet",
      icon: "🌱",
      recommendation: "Welcome to your pre-menstrual journey! This is an exciting time to learn about your body and prepare for your future cycles. Focus on building healthy habits now that will support your hormonal health.",
      tooltip: "Pre-menarche is a normal phase, typically occurring in teens aged 12-18. Building healthy foundations now is key."
    },
    {
      value: "stopped-period",
      label: "I stopped getting my period",
      icon: "🦋",
      recommendation: "Your body may be transitioning through menopause, perimenopause, or experiencing amenorrhea. Let's focus on understanding these hormonal shifts and supporting your well-being during this phase.",
      tooltip: "Amenorrhea can occur due to menopause, perimenopause, stress, or other factors. Understanding the cause helps provide better support."
    },
    {
      value: "unknown",
      label: "I don't remember",
      icon: "🤷",
      recommendation: "No problem! We'll remind you to track your next period. For now, we'll use general recommendations based on other answers you provide.",
      tooltip: "You can always update this later when you remember or when your next period starts."
    }
  ],
  
  // Questions for pre-menarche users
  ageRange: [
    {
      value: "10-12",
      label: "10-12 years old",
      icon: "🌸",
      recommendation: "You're at the perfect age to start learning about your body! Many people start their periods between 10-15, so it's great you're preparing early.",
      tooltip: "Pre-menarche education is important for feeling prepared and confident about upcoming changes."
    },
    {
      value: "13-15",
      label: "13-15 years old",
      icon: "🌺",
      recommendation: "This is a common age range for periods to start. Learning about cycles now will help you feel more confident when yours begins!",
      tooltip: "Most people start their periods between ages 12-15, so you're right in the typical range."
    },
    {
      value: "16-18",
      label: "16-18 years old",
      icon: "🌻",
      recommendation: "While periods can start later for some people, it's good to understand what to expect. We'll help you learn about normal variations in timing.",
      tooltip: "Some people naturally start their periods later, and that's completely normal too."
    },
    {
      value: "18+",
      label: "18+ years old",
      icon: "🌿",
      recommendation: "Starting periods later can be completely normal, but it's also good to understand when to check with a healthcare provider about timing.",
      tooltip: "While most people start by 18, later starts can be normal or may benefit from medical guidance."
    }
  ],

  learningGoals: [
    {
      value: "what-to-expect",
      label: "What to expect when my period starts",
      icon: "📚",
      recommendation: "Perfect! We'll teach you about period symptoms, what's normal, and how to prepare with products and self-care strategies.",
      tooltip: "Understanding what's normal helps reduce anxiety and builds confidence for when your period begins."
    },
    {
      value: "body-changes",
      label: "How my body is changing during puberty",
      icon: "🦋",
      recommendation: "Great choice! Puberty involves many changes beyond periods - we'll explain hormones, growth, and emotional changes you might experience.",
      tooltip: "Puberty involves complex hormonal changes that affect your entire body, not just your reproductive system."
    },
    {
      value: "healthy-habits",
      label: "Building healthy habits for hormonal health",
      icon: "💪",
      recommendation: "Excellent focus! The habits you build now will support your hormonal health for life. We'll cover nutrition, exercise, and stress management.",
      tooltip: "Starting healthy habits early creates a strong foundation for lifelong hormonal wellness."
    },
    {
      value: "managing-emotions",
      label: "Understanding and managing mood changes",
      icon: "🌈",
      recommendation: "Very important! Hormonal changes can affect emotions, and learning to understand and manage these feelings is a valuable life skill.",
      tooltip: "Hormones significantly impact mood and emotions - learning these patterns helps with emotional regulation."
    }
  ],

  // Questions for post-menopause/amenorrhea users
  currentSymptoms: [
    {
      value: "hot-flashes",
      label: "Hot flashes or night sweats",
      icon: "🔥",
      recommendation: "Hot flashes are common during perimenopause and menopause due to changing estrogen levels. We'll help you find cooling strategies and timing patterns.",
      tooltip: "Hot flashes affect up to 80% of people during menopause transition due to hormonal fluctuations."
    },
    {
      value: "mood-changes",
      label: "Mood swings or emotional changes",
      icon: "🌊",
      recommendation: "Hormonal transitions can significantly impact mood and emotions. We'll explore strategies for emotional balance during this phase.",
      tooltip: "Changing hormone levels, especially estrogen, can affect neurotransmitters that regulate mood."
    },
    {
      value: "sleep-issues",
      label: "Sleep problems or insomnia",
      icon: "🌙",
      recommendation: "Sleep disruption is very common during hormonal transitions. We'll help you create better sleep hygiene and understand the hormone-sleep connection.",
      tooltip: "Progesterone and estrogen changes can significantly impact sleep quality and patterns."
    },
    {
      value: "energy-fatigue",
      label: "Low energy or fatigue",
      icon: "🔋",
      recommendation: "Fatigue during hormonal transitions is real and valid. We'll explore energy-supporting strategies and when to seek additional help.",
      tooltip: "Hormonal changes can affect metabolism, sleep, and overall energy levels significantly."
    },
    {
      value: "no-symptoms",
      label: "No significant symptoms yet",
      icon: "✨",
      recommendation: "That's wonderful! Some people have easier transitions. We'll help you maintain this balance and know what to watch for.",
      tooltip: "Not everyone experiences significant symptoms during hormonal transitions, and that's perfectly normal."
    }
  ],

  copingStrategies: [
    {
      value: "medical-support",
      label: "Working with healthcare providers",
      icon: "🩺",
      recommendation: "Excellent approach! Medical guidance can be invaluable during hormonal transitions. We'll help you prepare questions and track symptoms for appointments.",
      tooltip: "Healthcare providers can offer various treatment options and monitoring for hormonal transitions."
    },
    {
      value: "lifestyle-changes",
      label: "Diet, exercise, and lifestyle adjustments",
      icon: "🥗",
      recommendation: "Lifestyle approaches can be very effective! We'll share evidence-based strategies for nutrition, movement, and stress management during this phase.",
      tooltip: "Lifestyle modifications can significantly help manage symptoms and support overall health during transitions."
    },
    {
      value: "natural-remedies",
      label: "Herbal remedies and supplements",
      icon: "🌿",
      recommendation: "Many people find natural approaches helpful! We'll discuss evidence-based options and when to check with healthcare providers about interactions.",
      tooltip: "Some natural remedies have research support, but it's important to understand safety and interactions."
    },
    {
      value: "support-groups",
      label: "Connecting with others in similar situations",
      icon: "👥",
      recommendation: "Community support is so valuable! Sharing experiences with others can provide comfort, tips, and reduce feelings of isolation during transitions.",
      tooltip: "Peer support can provide emotional comfort and practical strategies from people with similar experiences."
    },
    {
      value: "still-figuring-out",
      label: "Still figuring out what works for me",
      icon: "🔍",
      recommendation: "That's completely normal! Finding what works is a personal journey. We'll help you explore different approaches and track what helps you feel best.",
      tooltip: "Everyone's experience is unique, and it often takes time to find the right combination of strategies."
    }
  ],

  // Standard questions for regular cycles
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

// Define question flows based on period status
const getQuestionFlow = (periodStatus: string): string[] => {
  console.log('Getting question flow for period status:', periodStatus);
  
  if (periodStatus === "no-period-yet") {
    return ["lastPeriodStart", "ageRange", "learningGoals"];
  } else if (periodStatus === "stopped-period") {
    return ["lastPeriodStart", "currentSymptoms", "copingStrategies"];
  } else {
    // Regular cycle flow for current, calendar, or unknown
    return ["lastPeriodStart", "periodLength", "cyclePredictability", "ovulationSigns", "premenstrualSymptoms", "worstSymptom"];
  }
};

const QuestionTitles = {
  lastPeriodStart: "When did your last period start?",
  ageRange: "How old are you?",
  learningGoals: "What would you like to learn most about through Uteroo?",
  currentSymptoms: "What symptoms are you currently experiencing?",
  copingStrategies: "How are you managing these changes?",
  periodLength: "How long do your periods usually last?",
  cyclePredictability: "How predictable is your cycle?",
  ovulationSigns: "Do you notice any signs around ovulation?",
  premenstrualSymptoms: "How do you feel 5-7 days before your period?",
  worstSymptom: "What's your most annoying symptom?"
};

const screenRewards = [
  { points: 10, message: "Great start! +10 ❤️ added to your profile." },
  { points: 15, message: "You've unlocked Cycle Tracker Tooltip! +15 ❤️ added to your profile." },
  { points: 20, message: "You're a cycle pro! Here's your first booster 🎁 +20 ❤️ added to your profile." }
];

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionFlow, setQuestionFlow] = useState<string[]>(["lastPeriodStart"]);
  const [formData, setFormData] = useState({
    lastPeriodStart: "",
    ageRange: "",
    learningGoals: "",
    currentSymptoms: "",
    copingStrategies: "",
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
  const [isProcessing, setIsProcessing] = useState(false);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update question flow when period status changes
  useEffect(() => {
    if (formData.lastPeriodStart && formData.lastPeriodStart !== "") {
      const newFlow = getQuestionFlow(formData.lastPeriodStart);
      setQuestionFlow(newFlow);
      console.log('Updated question flow:', newFlow, 'for period status:', formData.lastPeriodStart);
    }
  }, [formData.lastPeriodStart]);

  // Determine user type based on period status with better logic
  const determineUserType = (periodStatus: string, selectedDate?: Date): string => {
    console.log('Determining user type for period status:', periodStatus, 'selected date:', selectedDate);
    
    if (periodStatus === "no-period-yet") {
      console.log('User type determined: PRE_MENSTRUAL');
      return 'PRE_MENSTRUAL';
    } else if (periodStatus === "stopped-period") {
      console.log('User type determined: POST_MENSTRUAL');
      return 'POST_MENSTRUAL';
    } else if (periodStatus === "current" || periodStatus === "calendar" || periodStatus === "unknown") {
      console.log('User type determined: MENSTRUAL');
      return 'MENSTRUAL';
    } else {
      console.log('User type determined: MENSTRUAL (default)');
      return 'MENSTRUAL';
    }
  };

  // Save onboarding data to Supabase with enhanced error handling and better logging
  const saveOnboardingData = async () => {
    if (!user) {
      console.error('No user found when trying to save onboarding data');
      throw new Error('User not authenticated');
    }

    try {
      console.log('=== STARTING ONBOARDING DATA SAVE ===');
      console.log('User ID:', user.id);
      console.log('Current form data:', formData);
      console.log('Selected date:', selectedDate);
      
      // Determine user type based on form data
      const userType = determineUserType(formData.lastPeriodStart, selectedDate);
      console.log('=== USER TYPE DETERMINED:', userType, '===');
      
      // Save user type classification with upsert to handle duplicates
      console.log('Saving user type to database...');
      const { error: userTypeError } = await supabase
        .from('user_types')
        .upsert({
          user_id: user.id,
          user_type: userType,
          classification_date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'user_id'
        });

      if (userTypeError) {
        console.error('❌ Error saving user type:', userTypeError);
        throw new Error(`Failed to save user type: ${userTypeError.message}`);
      }
      console.log('✅ User type saved successfully:', userType);

      // Prepare questionnaire responses for all answered questions
      const responses = [];
      const answeredQuestions = questionFlow.filter(q => {
        const value = formData[q as keyof typeof formData];
        return value !== "" && value !== null && value !== undefined;
      });
      
      console.log('Preparing questionnaire responses for questions:', answeredQuestions);
      
      for (const questionId of answeredQuestions) {
        const value = formData[questionId as keyof typeof formData];
        responses.push({
          user_id: user.id,
          questionnaire_type: 'onboarding_flow',
          question_id: questionId,
          question_text: QuestionTitles[questionId as keyof typeof QuestionTitles] || questionId,
          answer_value: value.toString(),
          answer_type: 'radio',
          user_type: userType
        });
      }

      // Save selected date if applicable
      if (selectedDate && formData.lastPeriodStart === "calendar") {
        responses.push({
          user_id: user.id,
          questionnaire_type: 'onboarding_flow',
          question_id: 'selected_period_date',
          question_text: 'Selected period start date',
          answer_value: selectedDate.toISOString().split('T')[0],
          user_type: userType
        });
      }

      if (responses.length > 0) {
        // Clear existing responses first to avoid duplicates
        console.log('Clearing existing questionnaire responses...');
        const { error: deleteError } = await supabase
          .from('questionnaire_responses')
          .delete()
          .eq('user_id', user.id)
          .eq('questionnaire_type', 'onboarding_flow');

        if (deleteError) {
          console.error('⚠️ Error clearing existing responses:', deleteError);
          // Don't throw here, just log and continue
        }

        console.log('Saving', responses.length, 'questionnaire responses...');
        const { error: responsesError } = await supabase
          .from('questionnaire_responses')
          .insert(responses);

        if (responsesError) {
          console.error('❌ Error saving questionnaire responses:', responsesError);
          throw new Error(`Failed to save responses: ${responsesError.message}`);
        }
        console.log('✅ Questionnaire responses saved successfully');
      }

      // Handle cycle tracking data for MENSTRUAL users
      if (userType === 'MENSTRUAL') {
        console.log('Creating cycle tracking data for MENSTRUAL user...');
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

        // Clear existing cycle data first
        const { error: deleteCycleError } = await supabase
          .from('cycle_tracking')
          .delete()
          .eq('user_id', user.id);

        if (deleteCycleError) {
          console.error('⚠️ Error clearing existing cycle data:', deleteCycleError);
        }

        // Save new cycle tracking data
        const { error: cycleError } = await supabase
          .from('cycle_tracking')
          .insert(cycleData);

        if (cycleError) {
          console.error('❌ Error saving cycle data:', cycleError);
          // Don't throw here as it's not critical for pre-menstrual users
          console.log('Cycle tracking creation failed, but continuing...');
        } else {
          console.log('✅ Cycle data saved successfully');
        }
      }

      // Prepare mood log data
      const symptoms = [];
      if (formData.premenstrualSymptoms) symptoms.push(formData.premenstrualSymptoms);
      if (formData.worstSymptom) symptoms.push(formData.worstSymptom);
      if (formData.ovulationSigns) symptoms.push(formData.ovulationSigns);
      if (formData.currentSymptoms) symptoms.push(formData.currentSymptoms);

      const moodData = {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        mood: formData.premenstrualSymptoms || formData.currentSymptoms || 'learning',
        symptoms: symptoms,
        notes: `Onboarding completed - User Type: ${userType}, Period status: ${formData.lastPeriodStart}`
      };

      // Save mood log data (clear existing first)
      console.log('Saving mood log data...');
      const { error: deleteMoodError } = await supabase
        .from('mood_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);

      if (deleteMoodError) {
        console.error('⚠️ Error clearing existing mood data:', deleteMoodError);
      }

      const { error: moodError } = await supabase
        .from('mood_logs')
        .insert(moodData);

      if (moodError) {
        console.error('❌ Error saving mood data:', moodError);
        // Don't throw here as it's not critical
        console.log('Mood log creation failed, but continuing...');
      } else {
        console.log('✅ Mood data saved successfully');
      }

      // Update profile to mark onboarding as completed
      console.log('Marking onboarding as completed in profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (profileError) {
        console.error('❌ Error updating profile:', profileError);
        // Don't throw here as the main data is saved
        console.log('Profile update failed, but main data saved successfully');
      } else {
        console.log('✅ Profile updated - onboarding marked as completed');
      }

      console.log('=== ONBOARDING DATA SAVE COMPLETED SUCCESSFULLY ===');
      console.log('Final user type:', userType);
      
    } catch (error) {
      console.error('❌❌❌ CRITICAL ERROR in saveOnboardingData:', error);
      throw error;
    }
  };

  const determineGameScreen = () => {
    // Check if user is pre-period and redirect to pre-period game
    const userType = determineUserType(formData.lastPeriodStart, selectedDate);
    console.log('Determining game screen for user type:', userType);
    
    if (userType === 'PRE_MENSTRUAL') {
      console.log('Redirecting to pre-period game');
      return "/pre-period-game";
    }
    // Always go to pou-game for other users
    console.log('Redirecting to pou-game');
    return "/pou-game";
  };

  const generateSummary = () => {
    // Handle special cases for new options
    if (formData.lastPeriodStart === "no-period-yet") {
      const ageText = formData.ageRange ? ` at ${formData.ageRange.replace('-', '-')} years old` : '';
      const learningFocus = formData.learningGoals ? 
        formData.learningGoals.replace('-', ' ').replace('what to expect', 'understanding what to expect')
          .replace('body changes', 'body changes during puberty')
          .replace('healthy habits', 'building healthy habits')
          .replace('managing emotions', 'managing emotional changes') : 'general wellness';

      const summary = `
        Welcome to your <strong>pre-menstrual journey</strong>! 🌱 You're${ageText} and focusing on <strong>${learningFocus}</strong>.
        <br><br>
        Your personalized <strong>Wellness Foundations</strong> focus:
        • Balanced nutrition with plenty of calcium and iron
        • Regular exercise to support bone health and overall development
        • Understanding your body and what to expect as you grow
        • Building healthy stress management and emotional regulation habits
        <br><br>
        Your Uteroo companion will help you learn about cycles, hormones, and prepare for this natural transition at your own pace. No rush - your body knows what it's doing! 🌸
      `;
      
      return summary;
    }

    if (formData.lastPeriodStart === "stopped-period") {
      const symptomText = formData.currentSymptoms ? 
        formData.currentSymptoms.replace('-', ' ').replace('hot flashes', 'hot flashes/night sweats')
          .replace('mood changes', 'mood fluctuations')
          .replace('sleep issues', 'sleep disruption')
          .replace('energy fatigue', 'fatigue')
          .replace('no symptoms', 'minimal symptoms') : 'various symptoms';
      
      const copingText = formData.copingStrategies ? 
        formData.copingStrategies.replace('-', ' ').replace('medical support', 'medical guidance')
          .replace('lifestyle changes', 'lifestyle modifications')
          .replace('natural remedies', 'natural approaches')
          .replace('support groups', 'community support')
          .replace('still figuring out', 'exploring different approaches') : 'various strategies';

      const summary = `
        Your body is transitioning through <strong>menopause, perimenopause, or experiencing amenorrhea</strong>. 🦋 You're currently experiencing <strong>${symptomText}</strong> and managing with <strong>${copingText}</strong>.
        <br><br>
        Your personalized support focus:
        • Managing symptoms like hot flashes, mood changes, or sleep disruption
        • Supporting bone health and cardiovascular health during this transition
        • Addressing potential root causes if experiencing amenorrhea
        • Adapting wellness strategies for your changing hormonal landscape
        <br><br>
        Uteroo will help you navigate this phase with personalized support for your unique experience. Every transition is different, and we're here for yours! 💜
      `;
      
      return summary;
    }

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
      return;
    }
    
    console.log(`Selecting option for ${field}:`, option.value);
    
    const newFormData = { ...formData, [field]: option.value };
    setFormData(newFormData);
    
    console.log('Updated form data:', newFormData);
    console.log('Current question flow:', questionFlow);
    
    // Create a floating heart
    const randomLeft = 50 + (Math.random() * 30 - 15);
    setFloatingHearts(prev => [...prev, {
      id: nextHeartId, 
      top: 70,
      left: randomLeft
    }]);
    setNextHeartId(prev => prev + 1);
    
    // Show recommendation toast
    toast({
      title: "Great choice!",
      description: option.recommendation,
    });

    // Award points and auto-advance to next question
    setHeartPoints(prev => prev + 5);
    
    setTimeout(() => {
      if (currentQuestionIndex < questionFlow.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        console.log('Last question answered, ready for results');
      }
    }, 1000);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setFormData({ ...formData, lastPeriodStart: "calendar" });
    
    const randomLeft = 50 + (Math.random() * 30 - 15);
    setFloatingHearts(prev => [...prev, {
      id: nextHeartId, 
      top: 70,
      left: randomLeft
    }]);
    setNextHeartId(prev => prev + 1);
    
    const option = formOptions.lastPeriodStart.find(o => o.value === "calendar");
    if (option) {
      toast({
        title: "Date selected!",
        description: option.recommendation,
      });
    }
    
    setHeartPoints(prev => prev + 5);
    
    setTimeout(() => {
      if (currentQuestionIndex < questionFlow.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1000);
  };

  // Handle login
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate("/pou-game");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Google login failed",
          description: error.message,
        });
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
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

  const currentQuestionHasAnswer = useMemo(() => {
    const currentQuestion = questionFlow[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const value = formData[currentQuestion as keyof typeof formData];
    return value !== "" && value !== null && value !== undefined;
  }, [questionFlow, currentQuestionIndex, formData]);

  const handleNext = async () => {
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }

    console.log('=== HANDLE NEXT CALLED ===');
    console.log('Current step:', step);
    console.log('Current question index:', currentQuestionIndex);
    console.log('Question flow length:', questionFlow.length);
    console.log('Form data:', formData);

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (currentQuestionIndex < questionFlow.length - 1) {
        // Check if current question is answered before advancing
        if (!currentQuestionHasAnswer) {
          toast({
            title: "Please answer the current question",
            description: "We need this information to personalize your experience",
            variant: "destructive",
          });
          return;
        }
        console.log('Advancing to next question');
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // At the last question - check if it's answered
        if (!currentQuestionHasAnswer) {
          toast({
            title: "Please answer the current question",
            description: "We need this information to personalize your experience",
            variant: "destructive",
          });
          return;
        }
        
        console.log('All questions answered, moving to summary');
        setStep(4); // Show summary
      }
    } else if (step === 4) {
      console.log('=== COMPLETING ONBOARDING FLOW ===');
      setIsProcessing(true);
      
      try {
        console.log('About to save onboarding data...');
        await saveOnboardingData();
        console.log('✅ Onboarding data saved successfully!');
        
        const gameRoute = determineGameScreen();
        console.log('Determined game route:', gameRoute);
        
        if (gameRoute === "/pre-period-game") {
          toast({
            title: "Welcome to your wellness journey!",
            description: "Let's start with understanding your daily habits!",
            duration: 5000,
          });
          console.log('Pre-period user - navigating to pre-period game');
        } else {
          toast({
            title: "Welcome to Uteroo!",
            description: "Time to meet your companion and give them a name!",
            duration: 5000,
          });
          console.log('Regular user - navigating to pou-game for companion naming');
        }
        
        console.log('🚀 NAVIGATING TO:', gameRoute);
        navigate(gameRoute);
        
      } catch (error) {
        console.error('❌❌❌ CRITICAL ERROR completing onboarding:', error);
        toast({
          title: "Error saving your data",
          description: error instanceof Error ? error.message : "Please try again or contact support if the issue persists.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
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
        <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                handleDateSelect(date);
              }
            }}
            initialFocus
            className="p-3 bg-white pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  };

  const currentQuestion = questionFlow[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6 bg-white/90 backdrop-blur-sm border shadow-md relative">
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

        {step === 1 ? (
          <div className="text-center space-y-6">
            <img
              src="/lovable-uploads/f135b894-cd85-4010-a103-0fc5cb07ea0d.png"
              alt="Welcome"
              className="w-80 h-auto mx-auto animate-bounce-slow"
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
            <div className="flex flex-col gap-4 justify-center">
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
              <Button
                onClick={() => setStep(5)}
                variant="outline"
                className="text-[#9370DB] border-[#9370DB] hover:bg-[#9370DB] hover:text-white px-8 rounded-full"
              >
                I ALREADY HAVE AN ACCOUNT
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
        ) : step === 5 ? (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-black">Welcome Back!</h1>
              <p className="text-gray-700">Sign in to continue your journey with Uteroo</p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email, phone, or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-full border-2 border-gray-200 focus:border-[#9370DB]"
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-full border-2 border-gray-200 focus:border-[#9370DB]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 py-3 rounded-full w-full"
              >
                {isLoading ? "Signing in..." : "SIGN IN"}
              </Button>
              
              <Button
                variant="outline"
                className="text-[#9370DB] border-[#9370DB] hover:bg-[#9370DB] hover:text-white px-8 py-3 rounded-full w-full"
              >
                Forgot my password
              </Button>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 gap-2 rounded-full h-16 w-16 flex items-center justify-center p-0 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-gray-200"
              >
                {isLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-800" />
                ) : (
                  <Icons.google className="h-8 w-8" />
                )}
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-[#9370DB]"
              >
                Back to main menu
              </Button>
            </div>
          </div>
        ) : step === 3 ? (
          <div className="space-y-6">
            {/* Single progress bar with hearts and screen indicator */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 w-full">
                <div className="text-gray-500 text-sm font-medium">
                  Screen {currentQuestionIndex + 1} of {questionFlow.length}
                </div>
                <Progress 
                  value={(currentQuestionIndex + 1) / questionFlow.length * 100} 
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
                Question {currentQuestionIndex + 1} of {questionFlow.length}
              </h2>
              <p className="text-gray-700 italic">
                Let's get to know your journey better
              </p>
            </div>

            {/* Only show question content if we have a valid current question */}
            {currentQuestion && formOptions[currentQuestion] ? (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 justify-center">
                  <h3 className="font-medium text-xl text-black text-center">
                    {QuestionTitles[currentQuestion as keyof typeof QuestionTitles]}
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className="text-[#9370DB] cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{formOptions[currentQuestion] && formOptions[currentQuestion][0]?.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                  {currentQuestion === "lastPeriodStart" && formOptions[currentQuestion][0].value === "calendar" && (
                    renderCalendarPopover()
                  )}
                  
                  {formOptions[currentQuestion] && formOptions[currentQuestion].map((option) => (
                    option.value !== "calendar" && (
                      <Button
                        key={option.value}
                        onClick={() => handleOptionSelect(currentQuestion, option)}
                        variant={formData[currentQuestion as keyof typeof formData] === option.value ? "default" : "outline"}
                        className={`w-full justify-start text-left h-auto py-4 px-6 rounded-full ${
                          formData[currentQuestion as keyof typeof formData] === option.value 
                            ? "bg-[#9370DB] text-white" 
                            : "text-black hover:bg-pink-50"
                        }`}
                        disabled={isProcessing}
                      >
                        {option.icon && <span className="mr-3 text-lg">{option.icon}</span>}
                        <span className="text-base">{option.label}</span>
                      </Button>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading question...</p>
              </div>
            )}

            <div className="flex gap-4 justify-between mt-8">
              {currentQuestionIndex > 0 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  variant="outline"
                  className="text-[#9370DB] hover:bg-pink-50 rounded-full"
                  disabled={isProcessing}
                >
                  Previous
                </Button>
              ) : (
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="text-[#FF69B4] hover:bg-pink-50 rounded-full"
                  disabled={isProcessing}
                >
                  Skip for now
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full"
                disabled={isProcessing || !currentQuestionHasAnswer}
              >
                {isProcessing ? "Processing..." : 
                 currentQuestionIndex === questionFlow.length - 1 ? "Get My Results" : "Next"}
              </Button>
            </div>

            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                <div>Current Question: {currentQuestion}</div>
                <div>Current Answer: {formData[currentQuestion as keyof typeof formData] || 'None'}</div>
                <div>Is Answered: {currentQuestionHasAnswer ? 'Yes' : 'No'}</div>
                <div>Question Flow: {questionFlow.join(', ')}</div>
              </div>
            )}
          </div>
        ) : (
          // Step 4 - Summary screen
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl shadow-sm border border-pink-100">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-bold text-[#9370DB]">Your Personalized Journey</h3>
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
                        <span className="text-xs">Why this recommendation?</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This personalized guidance is based on your specific situation, age, and goals. Uteroo adapts to your unique hormonal journey, whether you're preparing for cycles, currently cycling, or transitioning through different life phases.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={handleNext}
                className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white rounded-full px-8"
                disabled={isProcessing}
              >
                {isProcessing ? "Setting up your journey..." : "Continue to Game"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
