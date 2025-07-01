import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Heart, Brain, Users, Home, Trophy, Lightbulb, Zap, Shield, Target, Award } from "lucide-react";

interface PostMenstrualGameProps {
  onComplete: () => void;
  symptomResponses?: Record<string, number>;
}

interface TrueFalseQuestion {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
  category: 'hormonal-insight' | 'hrt-optimization' | 'nutrition' | 'gamified-wellness' | 'proactive-health';
  uniqueValue: string;
}

const postMenstrualQuestions: TrueFalseQuestion[] = [
  {
    id: '1',
    question: "Hot flashes are just random events with no deeper hormonal pattern to analyze",
    answer: false,
    explanation: "Uteroo's AI Diagnostics can identify symptom clusters (hot flashes + joint pain + cognitive fog) to suggest underlying hormonal imbalances, even examining post-ovarian adrenal function and gut microbiome impacts on estrogen recirculation.",
    category: 'hormonal-insight',
    uniqueValue: "Advanced root cause analysis beyond basic symptom logging"
  },
  {
    id: '2',
    question: "All forms of HRT work the same way for everyone",
    answer: false,
    explanation: "Uteroo's Pharmaco-Nutrition Interaction Engine analyzes your CYP450 enzyme polymorphisms to suggest optimal HRT delivery methods (transdermal vs. oral) and identifies potential interactions with medications or supplements.",
    category: 'hrt-optimization',
    uniqueValue: "Personalized HRT guidance based on your genetic profile"
  },
  {
    id: '3',
    question: "Post-menopause nutrition should focus on the same general healthy eating as any other life stage",
    answer: false,
    explanation: "Uteroo's Post-Menopause Metabolic Optimizer creates meal plans targeting sarcopenia prevention, inflammation reduction, and cardiovascular health based on your unique biomarker profile (C-reactive protein, glucose levels).",
    category: 'nutrition',
    uniqueValue: "Cycle-agnostic, biomarker-driven nutritional protocols"
  },
  {
    id: '4',
    question: "Gamification in health apps is just about daily streaks and basic rewards",
    answer: false,
    explanation: "Uteroo transforms your journey into 'Wisdom Levels' and 'Health Quests' like the 'Bone Builder Quest' or 'Sleep Sanctuary Quest,' with 'Symptom Boss Battles' where you defeat hot flashes and brain fog using evidence-based protocols.",
    category: 'gamified-wellness',
    uniqueValue: "Empowering quest-based approach to healthy aging"
  },
  {
    id: '5',
    question: "Most health apps help you plan proactively for post-menopause health risks",
    answer: false,
    explanation: "Unlike basic symptom trackers, Uteroo's Autoimmune Hormone Navigator helps you proactively manage bone density, cardiovascular risks, and autoimmune conditions through forward-looking health planning and personalized risk mitigation.",
    category: 'proactive-health',
    uniqueValue: "Proactive health risk management with autoimmune expertise"
  },
  {
    id: '6',
    question: "Elevated FSH/LH numbers are all you need to understand your post-menopause hormone status",
    answer: false,
    explanation: "Uteroo interprets the full spectrum: FSH/LH, but also nuanced Estradiol, Estrone, Testosterone, DHEA-S, and Cortisol metabolites. I explain what each means for YOUR body's adaptive hormonal landscape and connect it to your specific symptoms.",
    category: 'hormonal-insight',
    uniqueValue: "Comprehensive biomarker interpretation with personalized insights"
  },
  {
    id: '7',
    question: "Cruciferous vegetables are particularly important for post-menopause estrogen metabolism",
    answer: true,
    explanation: "Exactly! Uteroo's specialized nutrition protocols emphasize cruciferous vegetables for optimal estrogen clearance and anti-inflammatory benefits, tailored to your biomarker profile including C-reactive protein levels.",
    category: 'nutrition',
    uniqueValue: "Evidence-based post-menopausal nutrition with biomarker targeting"
  },
  {
    id: '8',
    question: "Your genetics can influence how you process different types of hormone therapy",
    answer: true,
    explanation: "Absolutely! Uteroo analyzes your CYP450 enzyme polymorphisms to understand how you metabolize hormones, suggesting specific HRT delivery methods and identifying potential nutrient depletions from different HRT formulations.",
    category: 'hrt-optimization',
    uniqueValue: "Nutrigenomics-based HRT optimization"
  },
  {
    id: '9',
    question: "Weight-bearing exercise becomes more critical after menopause for bone health",
    answer: true,
    explanation: "Correct! Uteroo's Health Quests include the 'Bone Builder Quest' focusing on weight-bearing exercises and ensuring adequate Vitamin D and K2 intake, especially important for users with family history of osteoporosis.",
    category: 'proactive-health',
    uniqueValue: "Targeted bone health optimization through gamified challenges"
  },
  {
    id: '10',
    question: "St. John's Wort can interfere with hormone therapy effectiveness",
    answer: true,
    explanation: "Yes! This is exactly why Uteroo's Pharmaco-Nutrition Interaction Engine is invaluable - identifying interactions between botanicals like St. John's Wort and HRT, plus advising on nutrient depletions from specific hormone formulations.",
    category: 'hrt-optimization',
    uniqueValue: "Comprehensive drug-nutrient-herb interaction analysis"
  }
];

export const PostMenstrualGame = ({ onComplete, symptomResponses }: PostMenstrualGameProps) => {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'game' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const currentQuestion = postMenstrualQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / postMenstrualQuestions.length) * 100;

  const generatePersonalizedFeedback = () => {
    if (!symptomResponses) return null;

    const highIntensitySymptoms = Object.entries(symptomResponses)
      .filter(([_, value]) => value >= 7)
      .map(([symptom, _]) => symptom);

    const moderateIntensitySymptoms = Object.entries(symptomResponses)
      .filter(([_, value]) => value >= 4 && value < 7)
      .map(([symptom, _]) => symptom);

    const lowIntensitySymptoms = Object.entries(symptomResponses)
      .filter(([_, value]) => value < 4)
      .map(([symptom, _]) => symptom);

    // Analyze symptom patterns
    const vasomotorSymptoms = ['hot_flashes', 'night_sweats'];
    const moodCognitiveSymptoms = ['mood_swings', 'anxiety', 'depressed_mood', 'brain_fog'];
    const urogenitalSymptoms = ['vaginal_dryness', 'painful_intercourse', 'urinary_urgency'];
    const physicalSymptoms = ['joint_pain', 'hair_thinning', 'weight_gain', 'fatigue'];

    const hasHighVasomotor = vasomotorSymptoms.some(s => symptomResponses[s] >= 7);
    const hasHighMoodCognitive = moodCognitiveSymptoms.some(s => symptomResponses[s] >= 7);
    const hasHighUrogenital = urogenitalSymptoms.some(s => symptomResponses[s] >= 7);
    const hasHighPhysical = physicalSymptoms.some(s => symptomResponses[s] >= 7);

    let clinicalContext = "";
    let actionableAdvice = "";
    let nextSteps = "";

    // Clinical Context
    if (hasHighVasomotor) {
      clinicalContext = "Thank you for sharing your experience. It appears you're navigating significant vasomotor symptoms, which are a very common aspect of fluctuating estrogen levels during this transition. Please know you are not alone in experiencing this.";
    } else if (hasHighMoodCognitive) {
      clinicalContext = "We understand that mood and cognitive shifts can be challenging. Your responses indicate a strong pattern here, often tied to hormonal changes impacting brain chemistry. It's important to acknowledge these feelings, and Uteroo is here to support you.";
    } else if (hasHighUrogenital) {
      clinicalContext = "Your input highlights notable changes in urogenital health. These are common and directly related to the impact of lower estrogen on these sensitive tissues. We recognize the discomfort this can bring.";
    } else if (hasHighPhysical) {
      clinicalContext = "We hear that you're experiencing several physical changes. It's quite common for hormonal shifts during this phase to influence metabolism, joint comfort, and energy levels. We aim to help you understand and manage these shifts.";
    } else if (moderateIntensitySymptoms.length > 0) {
      clinicalContext = "Thank you for sharing. Your current experience reflects a mix of common menopausal symptoms. Understanding these patterns is a powerful first step towards enhancing your well-being, and we're here to guide you.";
    } else {
      clinicalContext = "It sounds like you're navigating this phase with remarkable comfort. We're delighted to see this, and Uteroo can help you continue to maintain this sense of well-being.";
    }

    // Actionable Advice
    if (hasHighVasomotor) {
      actionableAdvice = "**Cooling Catalyst Booster:** Consider layering your clothing and keeping cool water readily available. Exploring **Sage Leaf extract** could be beneficial for reducing hot flash frequency.";
    } else if (symptomResponses['insomnia'] >= 7 || symptomResponses['restless_sleep'] >= 7) {
      actionableAdvice = "**Dream Weaver Booster:** Establishing a consistent bedtime routine and ensuring your bedroom is cool, dark, and quiet can significantly improve sleep quality. **Magnesium Glycinate** (200-400mg before bed) may support relaxation.";
    } else if (hasHighMoodCognitive) {
      actionableAdvice = "**Calm Keeper Booster:** Dedicating 10 minutes daily to journaling can be a powerful tool for processing emotions. Many find **Ashwagandha** helpful in managing stress and emotional balance during hormonal shifts.";
    } else if (hasHighUrogenital) {
      actionableAdvice = "**Comfort Bloom Booster:** Exploring a high-quality vaginal moisturizer or lubricant can significantly alleviate discomfort and improve intimacy.";
    } else if (symptomResponses['joint_pain'] >= 7) {
      actionableAdvice = "**Flexibility Flow Booster:** Incorporating Omega-3 fatty acids can be beneficial for inflammation and joint comfort.";
    } else if (symptomResponses['fatigue'] >= 7) {
      actionableAdvice = "**Energy Surge Booster:** Prioritize nutrient-dense foods, particularly those rich in B vitamins and iron, to support sustained energy levels.";
    } else {
      actionableAdvice = "Remember the importance of consistent hydration throughout your day; it supports overall well-being. Your continued symptom tracking helps us understand your unique patterns even more deeply.";
    }

    // Next Steps
    const hasHighSeveritySymptoms = highIntensitySymptoms.length > 0 && Math.max(...Object.values(symptomResponses)) >= 8;
    const hasMultipleHighSymptoms = highIntensitySymptoms.length >= 3;

    if (hasHighSeveritySymptoms || hasMultipleHighSymptoms) {
      nextSteps = "For a more comprehensive understanding of your hormonal landscape, we suggest discussing a **hormone panel (e.g., serum Estradiol, FSH, LH)** with your healthcare provider. If any symptoms are significantly impacting your quality of life, we strongly recommend exploring all available management strategies with your healthcare provider.";
    } else if (moderateIntensitySymptoms.length > 0) {
      nextSteps = "Consistent tracking of your symptoms within Uteroo will continue to reveal more precise patterns. Over time, Uteroo's 'Medical Predictive Analytics' will become even more adept at offering finely tuned, predictive guidance tailored just for you.";
    } else {
      nextSteps = "It's wonderful that you're experiencing this phase with such ease. We encourage you to continue consistent tracking; this helps us ensure you sustain this comfort and empower you with proactive strategies for any future shifts.";
    }

    return {
      clinicalContext,
      actionableAdvice,
      nextSteps
    };
  };

  const personalizedFeedback = generatePersonalizedFeedback();

  const handleAnswerSelect = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < postMenstrualQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentScreen('results');
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / postMenstrualQuestions.length) * 100;
    if (percentage >= 80) return "Outstanding! You understand Uteroo's revolutionary approach to post-menopause wellness! 🌟";
    if (percentage >= 60) return "Excellent! You're ready to experience Uteroo's specialized post-menopause support! 💪";
    if (percentage >= 40) return "Great foundation! Uteroo will unlock even deeper insights for your journey! 📚";
    return "Perfect starting point! Uteroo's comprehensive approach will transform your understanding! 🌱";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hormonal-insight': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'hrt-optimization': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'nutrition': return <Heart className="w-5 h-5 text-green-500" />;
      case 'gamified-wellness': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'proactive-health': return <Shield className="w-5 h-5 text-red-500" />;
      default: return <Lightbulb className="w-5 h-5 text-indigo-500" />;
    }
  };

  if (currentScreen === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-600 mb-4">
              🦋 Welcome to Your Uteroo Wellness Revolution! 🦋
            </CardTitle>
            {personalizedFeedback && (
              <div className="text-left space-y-6 mt-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4">Your Personalized Assessment</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-2">Clinical Context & Initial Insights:</h4>
                      <p className="text-gray-700">{personalizedFeedback.clinicalContext}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-2">Science Boosters & Wellness Quests:</h4>
                      <p className="text-gray-700">{personalizedFeedback.actionableAdvice}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-2">Next Steps & Recommendations:</h4>
                      <p className="text-gray-700">{personalizedFeedback.nextSteps}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!personalizedFeedback && (
              <p className="text-lg text-gray-700 mb-4">
                You're about to discover how Uteroo, powered by Peri's multidisciplinary expertise, goes far beyond basic tracking to provide precision, personalization, and proactive health management for your post-menstrual journey.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">Uteroo's Unique Post-Menopause Value:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-600">Advanced Hormonal Insights</h4>
                    <p className="text-sm text-gray-600">AI diagnostics for root cause analysis beyond basic symptom tracking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-600">HRT Optimization</h4>
                    <p className="text-sm text-gray-600">Personalized guidance based on your genetic profile and interactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-600">Biomarker-Driven Nutrition</h4>
                    <p className="text-sm text-gray-600">Post-menopause metabolic optimization tailored to your lab results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-600">Proactive Health Planning</h4>
                    <p className="text-sm text-gray-600">Forward-looking risk mitigation and autoimmune navigation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-700">Gamified Wellness Journey</h3>
              </div>
              <p className="text-yellow-700">
                Transform your health journey into empowering "Wisdom Levels" and "Health Quests" - from "Bone Builder Quests" to "Symptom Boss Battles" against hot flashes and brain fog!
              </p>
            </div>
            <Button 
              onClick={() => setCurrentScreen('game')}
              className="w-full text-lg py-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full"
            >
              {personalizedFeedback ? 'Continue Your Wellness Journey! ✨' : 'Discover Uteroo\'s Revolutionary Approach! ✨'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'game') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {postMenstrualQuestions.length}
              </p>
              <p className="text-sm text-purple-600 font-medium">Score: {score}/{answeredQuestions.length}</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              {getCategoryIcon(currentQuestion.category)}
              <CardTitle className="text-xl font-bold text-gray-800">
                True or False? 🤔
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-lg font-medium text-gray-800 mb-6 text-center leading-relaxed">
                {currentQuestion.question}
              </p>
              
              {!showExplanation && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAnswerSelect(true)}
                    variant="outline"
                    className="py-8 text-lg font-semibold hover:bg-green-50 hover:border-green-500 rounded-full"
                  >
                    <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                    TRUE
                  </Button>
                  <Button
                    onClick={() => handleAnswerSelect(false)}
                    variant="outline"
                    className="py-8 text-lg font-semibold hover:bg-red-50 hover:border-red-500 rounded-full"
                  >
                    <XCircle className="w-6 h-6 mr-2 text-red-500" />
                    FALSE
                  </Button>
                </div>
              )}

              {showExplanation && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${selectedAnswer === currentQuestion.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === currentQuestion.answer ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <span className="font-semibold">
                        {selectedAnswer === currentQuestion.answer ? 'Excellent!' : 'Not quite right!'}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      The answer is <strong>{currentQuestion.answer ? 'TRUE' : 'FALSE'}</strong>.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2 mb-2">
                      {getCategoryIcon(currentQuestion.category)}
                      <h4 className="font-semibold text-blue-800">Uteroo's Advantage:</h4>
                    </div>
                    <p className="text-blue-700 mb-3">{currentQuestion.explanation}</p>
                    <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                      <p className="text-sm font-medium text-purple-700">
                        <strong>Unique Value:</strong> {currentQuestion.uniqueValue}
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleNextQuestion}
                    className="w-full py-4 text-lg rounded-full"
                  >
                    {currentQuestionIndex < postMenstrualQuestions.length - 1 ? 'Next Question →' : 'See Your Results! 🎉'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-600 mb-4">
              🎉 Welcome to Your Uteroo Journey! 🎉
            </CardTitle>
            <p className="text-xl text-gray-700">
              You scored {score} out of {postMenstrualQuestions.length}!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg text-center">
              <p className="text-lg font-medium text-gray-800 mb-4">
                {getScoreMessage()}
              </p>
              <div className="text-6xl mb-4">
                {score >= 8 ? '🌟' : score >= 6 ? '💪' : score >= 4 ? '📚' : '🌱'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Your Uteroo Advantage:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-600">AI Hormone Analytics</h4>
                    <p className="text-sm text-gray-600">Root cause analysis beyond symptom logging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-600">Personalized HRT Guidance</h4>
                    <p className="text-sm text-gray-600">Genetic-based optimization & interaction analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-600">Biomarker-Driven Nutrition</h4>
                    <p className="text-sm text-gray-600">Metabolic optimization based on your labs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-600">Gamified Wellness Quests</h4>
                    <p className="text-sm text-gray-600">Wisdom Levels & Health Boss Battles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-lg text-green-700 mb-3">Ready to Begin Your Health Quests?</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Unlock "Bone Builder Quest" for osteoporosis prevention
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Battle symptom "bosses" with evidence-based protocols
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Access AI-powered biomarker interpretation
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-500" />
                  Get personalized nutrition for your metabolic profile
                </li>
              </ul>
            </div>

            <Button 
              onClick={onComplete}
              className="w-full text-lg py-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full"
            >
              Launch Your Uteroo Wellness Journey! ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
