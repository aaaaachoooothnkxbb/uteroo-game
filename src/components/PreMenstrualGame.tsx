
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Heart, Brain, Users, Home, Trophy, Lightbulb } from "lucide-react";

interface PreMenstrualGameProps {
  onComplete: () => void;
}

interface TrueFalseQuestion {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
  category: 'myth' | 'fear' | 'health';
}

const trueFalseQuestions: TrueFalseQuestion[] = [
  {
    id: '1',
    question: "You can't swim or exercise during your period",
    answer: false,
    explanation: "This is a myth! Exercise and swimming are actually great during your period and can help reduce cramps and improve mood.",
    category: 'myth'
  },
  {
    id: '2',
    question: "It's normal for periods to be irregular when you first start menstruating",
    answer: true,
    explanation: "Absolutely true! It can take 1-2 years for your cycle to become regular as your body adjusts to hormonal changes.",
    category: 'health'
  },
  {
    id: '3',
    question: "Having your period means you can't handle stress or make important decisions",
    answer: false,
    explanation: "This is completely false! Menstruation doesn't affect your ability to think clearly or handle responsibilities.",
    category: 'myth'
  },
  {
    id: '4',
    question: "Talking to trusted adults about periods is important for your health",
    answer: true,
    explanation: "Yes! Having open conversations with parents, doctors, or trusted adults helps you stay informed and healthy.",
    category: 'health'
  },
  {
    id: '5',
    question: "You'll automatically gain a lot of weight when you start your period",
    answer: false,
    explanation: "Not true! While some temporary bloating is normal, periods don't cause significant weight gain.",
    category: 'fear'
  },
  {
    id: '6',
    question: "Everyone will know when you have your period",
    answer: false,
    explanation: "This is a common fear, but periods are private! With proper products and hygiene, no one will know unless you choose to tell them.",
    category: 'fear'
  },
  {
    id: '7',
    question: "Eating nutritious foods can help with period symptoms",
    answer: true,
    explanation: "True! Foods rich in iron, calcium, and healthy fats can help reduce cramps and support overall health during your cycle.",
    category: 'health'
  },
  {
    id: '8',
    question: "Your first period will be extremely painful and heavy",
    answer: false,
    explanation: "Not necessarily! First periods are often lighter and less painful. Every person's experience is different.",
    category: 'fear'
  }
];

const maslowLevels = [
  {
    level: "Physiological Needs",
    icon: <Heart className="w-6 h-6 text-red-500" />,
    description: "Basic body needs: nutritious food, clean water, enough sleep, and proper hygiene",
    habits: ["Eat balanced meals", "Drink plenty of water", "Get 8-9 hours of sleep", "Practice good hygiene"]
  },
  {
    level: "Safety & Security",
    icon: <Home className="w-6 h-6 text-orange-500" />,
    description: "Feeling safe and secure in your environment and relationships",
    habits: ["Build trust with family", "Learn about your body", "Create safe spaces", "Know who to talk to"]
  },
  {
    level: "Love & Belonging",
    icon: <Users className="w-6 h-6 text-yellow-500" />,
    description: "Connection with family, friends, and community",
    habits: ["Share feelings with trusted people", "Join supportive groups", "Maintain friendships", "Express yourself"]
  },
  {
    level: "Self-Esteem",
    icon: <Trophy className="w-6 h-6 text-green-500" />,
    description: "Confidence in yourself and your abilities",
    habits: ["Celebrate small wins", "Practice self-care", "Learn new skills", "Accept compliments"]
  },
  {
    level: "Self-Actualization",
    icon: <Brain className="w-6 h-6 text-blue-500" />,
    description: "Becoming your best self and reaching your potential",
    habits: ["Set personal goals", "Help others", "Be creative", "Stay curious and keep learning"]
  }
];

export const PreMenstrualGame = ({ onComplete }: PreMenstrualGameProps) => {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'maslow' | 'game' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const currentQuestion = trueFalseQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / trueFalseQuestions.length) * 100;

  const handleAnswerSelect = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < trueFalseQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentScreen('results');
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / trueFalseQuestions.length) * 100;
    if (percentage >= 80) return "Amazing! You're well-informed about periods and health! 🌟";
    if (percentage >= 60) return "Great job! You have good knowledge and are learning well! 💪";
    if (percentage >= 40) return "Good start! Keep learning and asking questions! 📚";
    return "That's okay! The most important thing is that you're learning! 🌱";
  };

  if (currentScreen === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-pink-600 mb-4">
              🌸 Welcome to Your Pre-Menstrual Journey! 🌸
            </CardTitle>
            <p className="text-lg text-gray-700">
              You're about to learn some amazing things about growing up, staying healthy, and feeling confident about the changes in your body!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-pink-700 mb-3">What you'll discover:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  How to build healthy habits that make you feel amazing
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  The truth about common period myths and fears
                </li>
                <li className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Fun facts that will make you feel more confident
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => setCurrentScreen('maslow')}
              className="w-full text-lg py-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Let's Start Learning! ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'maslow') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-600 mb-2">
              🏔️ Your Wellness Pyramid 🏔️
            </CardTitle>
            <p className="text-gray-700">
              Just like building a pyramid, we build our health step by step, starting with the basics!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {maslowLevels.map((level, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gradient-to-b from-pink-400 to-purple-400">
                  <div className="flex items-start gap-3">
                    {level.icon}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{level.level}</h3>
                      <p className="text-gray-600 mb-3">{level.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {level.habits.map((habit, habitIndex) => (
                          <div key={habitIndex} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {habit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg mt-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Remember:</h3>
              <p className="text-gray-700">
                Building these habits takes time, and that's perfectly okay! Every small step counts toward feeling your best. 
                Starting with the basics (like good food and sleep) makes everything else easier! 💪
              </p>
            </div>
            <Button 
              onClick={() => setCurrentScreen('game')}
              className="w-full text-lg py-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              Ready for the True/False Game! 🎮
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'game') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {trueFalseQuestions.length}
              </p>
              <p className="text-sm text-purple-600 font-medium">Score: {score}/{answeredQuestions.length}</p>
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              True or False? 🤔
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-lg font-medium text-gray-800 mb-6 text-center">
                {currentQuestion.question}
              </p>
              
              {!showExplanation && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAnswerSelect(true)}
                    variant="outline"
                    className="py-8 text-lg font-semibold hover:bg-green-50 hover:border-green-500"
                  >
                    <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                    TRUE
                  </Button>
                  <Button
                    onClick={() => handleAnswerSelect(false)}
                    variant="outline"
                    className="py-8 text-lg font-semibold hover:bg-red-50 hover:border-red-500"
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
                        {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Not quite right!'}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      The answer is <strong>{currentQuestion.answer ? 'TRUE' : 'FALSE'}</strong>.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Why?</h4>
                    <p className="text-blue-700">{currentQuestion.explanation}</p>
                  </div>

                  <Button 
                    onClick={handleNextQuestion}
                    className="w-full py-4 text-lg"
                  >
                    {currentQuestionIndex < trueFalseQuestions.length - 1 ? 'Next Question →' : 'See Results! 🎉'}
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-600 mb-4">
              🎉 Congratulations! 🎉
            </CardTitle>
            <p className="text-xl text-gray-700">
              You scored {score} out of {trueFalseQuestions.length}!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg text-center">
              <p className="text-lg font-medium text-gray-800 mb-4">
                {getScoreMessage()}
              </p>
              <div className="text-6xl mb-4">
                {score >= 6 ? '🌟' : score >= 4 ? '💪' : score >= 2 ? '📚' : '🌱'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Key Takeaways:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-pink-500 mt-0.5" />
                  Your body is amazing and preparing for natural changes
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
                  Knowledge helps replace fears with confidence
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                  It's always okay to ask questions and seek support
                </li>
                <li className="flex items-start gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
                  You're prepared and ready for this journey!
                </li>
              </ul>
            </div>

            <Button 
              onClick={onComplete}
              className="w-full text-lg py-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Continue to Your Uteroo Journey! ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
