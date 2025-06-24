
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Heart, Brain, Users, Home, Trophy, Lightbulb } from "lucide-react";

interface PostMenstrualGameProps {
  onComplete: () => void;
}

interface TrueFalseQuestion {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
  category: 'myth' | 'health' | 'wellness';
}

const postMenstrualQuestions: TrueFalseQuestion[] = [
  {
    id: '1',
    question: "Hot flashes are the only symptom of menopause",
    answer: false,
    explanation: "Menopause can cause many symptoms including sleep changes, mood swings, joint aches, and brain fog - not just hot flashes!",
    category: 'myth'
  },
  {
    id: '2',
    question: "Regular exercise can help manage menopause symptoms",
    answer: true,
    explanation: "Exercise is fantastic for managing menopause! It helps with mood, bone health, sleep quality, and can reduce hot flashes.",
    category: 'health'
  },
  {
    id: '3',
    question: "You should avoid all hormonal treatments during menopause",
    answer: false,
    explanation: "While not for everyone, hormone therapy can be beneficial for many women when discussed with healthcare providers.",
    category: 'myth'
  },
  {
    id: '4',
    question: "Calcium and vitamin D become more important after menopause",
    answer: true,
    explanation: "Yes! These nutrients are crucial for bone health, which becomes especially important as estrogen levels decline.",
    category: 'health'
  },
  {
    id: '5',
    question: "Menopause means your health will automatically decline",
    answer: false,
    explanation: "Not true! With proper care, nutrition, and lifestyle choices, you can maintain excellent health through and after menopause.",
    category: 'myth'
  },
  {
    id: '6',
    question: "Staying socially connected is important for wellness during this transition",
    answer: true,
    explanation: "Absolutely! Social connections provide emotional support and can significantly improve your overall well-being during menopause.",
    category: 'wellness'
  },
  {
    id: '7',
    question: "Brain fog during menopause is permanent",
    answer: false,
    explanation: "Brain fog is often temporary and can improve with lifestyle changes, stress management, and sometimes medical support.",
    category: 'myth'
  },
  {
    id: '8',
    question: "Mindfulness and stress reduction can help with menopause symptoms",
    answer: true,
    explanation: "Yes! Stress management techniques like meditation, yoga, and mindfulness can significantly help manage symptoms.",
    category: 'wellness'
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
    if (percentage >= 80) return "Wonderful! You're well-informed about this life transition! 🌟";
    if (percentage >= 60) return "Great job! You have solid knowledge about menopause wellness! 💪";
    if (percentage >= 40) return "Good foundation! Keep learning and exploring! 📚";
    return "Every step of learning is valuable! You're on a great path! 🌱";
  };

  if (currentScreen === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-600 mb-4">
              🦋 Welcome to Your Wellness Journey! 🦋
            </CardTitle>
            <p className="text-lg text-gray-700">
              You're entering a beautiful new chapter of life! Let's explore what you know about staying healthy, vibrant, and confident during this transition.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">What you'll discover:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-500" />
                  Evidence-based wellness strategies for this life phase
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  Facts vs. myths about menopause and health
                </li>
                <li className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Empowering knowledge for your continued vitality
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => setCurrentScreen('game')}
              className="w-full text-lg py-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full"
            >
              Let's Begin This Journey! ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'game') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {postMenstrualQuestions.length}
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
                    <h4 className="font-semibold text-blue-800 mb-2">Why?</h4>
                    <p className="text-blue-700">{currentQuestion.explanation}</p>
                  </div>

                  <Button 
                    onClick={handleNextQuestion}
                    className="w-full py-4 text-lg rounded-full"
                  >
                    {currentQuestionIndex < postMenstrualQuestions.length - 1 ? 'Next Question →' : 'See Results! 🎉'}
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
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-600 mb-4">
              🎉 Wonderful Journey! 🎉
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
                {score >= 6 ? '🌟' : score >= 4 ? '💪' : score >= 2 ? '📚' : '🌱'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Key Takeaways:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-purple-500 mt-0.5" />
                  This transition is a natural, beautiful part of life
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-indigo-500 mt-0.5" />
                  Knowledge empowers you to make informed health choices
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                  Support from healthcare providers and community is invaluable
                </li>
                <li className="flex items-start gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
                  You have the wisdom and strength for this journey!
                </li>
              </ul>
            </div>

            <Button 
              onClick={onComplete}
              className="w-full text-lg py-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full"
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
