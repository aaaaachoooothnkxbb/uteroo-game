
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Heart, Brain, Users, Home, Trophy, Lightbulb, Zap, Shield, Target, Award } from "lucide-react";

interface PostMenstrualGameProps {
  onComplete: () => void;
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

export const PostMenstrualGame = ({ onComplete }: PostMenstrualGameProps) => {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'game' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const currentQuestion = postMenstrualQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / postMenstrualQuestions.length) * 100;

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
            <p className="text-lg text-gray-700 mb-4">
              You're about to discover how Uteroo, powered by Peri's multidisciplinary expertise, goes far beyond basic tracking to provide precision, personalization, and proactive health management for your post-menstrual journey.
            </p>
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
              Discover Uteroo's Revolutionary Approach! ✨
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
