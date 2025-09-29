import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Heart, BookOpen, Zap, Shield } from "lucide-react";

interface MenstrualGameProps {
  onComplete: () => void;
}

interface TrueFalseQuestion {
  id: number;
  question: string;
  answer: boolean;
  explanation: string;
  category: "pain" | "cycle" | "productivity" | "advocacy";
  value: string;
}

const menstrualQuestions: TrueFalseQuestion[] = [
  {
    id: 1,
    question: "Severe period pain that prevents you from going to school or work is normal and just something to endure.",
    answer: false,
    explanation: "Severe pain (dysmenorrhea) that disrupts daily activities may indicate conditions like endometriosis, PCOS, or adenomyosis. Pain that requires you to miss school/work warrants medical investigation.",
    category: "pain",
    value: "pain_normalization"
  },
  {
    id: 2,
    question: "Soaking through a pad or tampon every hour is considered heavy bleeding and should be evaluated by a doctor.",
    answer: true,
    explanation: "Menorrhagia (heavy bleeding) is defined as soaking through protection hourly or bleeding lasting more than 7 days. This can lead to anemia and may indicate fibroids, hormonal imbalances, or other conditions requiring treatment.",
    category: "pain",
    value: "heavy_bleeding"
  },
  {
    id: 3,
    question: "Your energy and focus naturally fluctuate throughout your menstrual cycle, and it's okay to adjust your schedule accordingly.",
    answer: true,
    explanation: "Hormonal changes throughout your cycle affect neurotransmitters, energy levels, and cognitive function. Cycle syncing—planning activities around your natural energy patterns—can optimize performance and reduce burnout.",
    category: "productivity",
    value: "cycle_syncing"
  },
  {
    id: 4,
    question: "If your doctor dismisses your period pain as 'just cramps,' you should accept their opinion and not seek a second opinion.",
    answer: false,
    explanation: "Medical gaslighting is real, especially in women's health. Endometriosis takes an average of 7-10 years to diagnose. If pain disrupts your life, you deserve thorough investigation. Seek providers who listen and validate your experience.",
    category: "advocacy",
    value: "medical_gaslighting"
  },
  {
    id: 5,
    question: "PMS (Premenstrual Syndrome) and PMDD (Premenstrual Dysphoric Disorder) are the same thing.",
    answer: false,
    explanation: "PMDD is a severe form of PMS affecting 5-8% of menstruating people. It involves severe depression, anxiety, or mood swings that significantly impair daily functioning. PMDD is a clinical diagnosis requiring professional treatment.",
    category: "cycle",
    value: "pmdd_awareness"
  },
  {
    id: 6,
    question: "Irregular periods in your teens and early 20s always indicate a serious health problem.",
    answer: false,
    explanation: "While regular cycles are ideal, irregular periods are common in the first few years post-menarche as the body establishes ovulatory cycles. However, consistently irregular periods (>45 days apart or <21 days) after age 16-18 warrant evaluation for PCOS or thyroid issues.",
    category: "cycle",
    value: "irregular_cycles"
  },
  {
    id: 7,
    question: "You should be able to perform at the same level every day of your cycle without any adjustments.",
    answer: false,
    explanation: "This expectation ignores biological reality. Estrogen and progesterone fluctuations affect everything from muscle recovery to cognitive function. Elite athletes adjust training to their cycle phases—you can too.",
    category: "productivity",
    value: "performance_expectations"
  },
  {
    id: 8,
    question: "Tracking your cycle can help you predict symptoms, plan activities, and identify patterns that may need medical attention.",
    answer: true,
    explanation: "Cycle tracking provides valuable data about your patterns, helps predict symptom timing, identifies irregularities, and creates documentation to share with healthcare providers. Knowledge is power.",
    category: "cycle",
    value: "cycle_tracking"
  },
  {
    id: 9,
    question: "Pain during sex (dyspareunia) related to your cycle is always normal and doesn't need medical evaluation.",
    answer: false,
    explanation: "While some people experience temporary sensitivity during certain cycle phases, persistent or severe pain during sex can indicate endometriosis, pelvic inflammatory disease, or other conditions. This deserves medical attention.",
    category: "pain",
    value: "dyspareunia"
  },
  {
    id: 10,
    question: "Advocating for yourself in medical settings—like asking questions, requesting tests, or seeking second opinions—is your right.",
    answer: true,
    explanation: "You are the expert on your body. Asking questions, documenting symptoms, requesting specific tests, and seeking second opinions are acts of self-advocacy, not being 'difficult.' Your healthcare is a partnership.",
    category: "advocacy",
    value: "self_advocacy"
  }
];

export const MenstrualGame = ({ onComplete }: MenstrualGameProps) => {
  const [currentScreen, setCurrentScreen] = useState<"intro" | "game" | "results">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const currentQuestion = menstrualQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === currentQuestion.answer && !answeredQuestions.has(currentQuestion.id)) {
      setScore(score + 1);
      setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestion.id));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < menstrualQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentScreen("results");
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / menstrualQuestions.length) * 100;
    if (percentage >= 90) return "Cycle Expert! You're well-informed about menstrual health. 🌟";
    if (percentage >= 70) return "Cycle Advocate! You have solid knowledge about your health. 💪";
    if (percentage >= 50) return "Cycle Learner! You're building important health literacy. 📚";
    return "Cycle Explorer! There's so much to discover about your body. Keep learning! 🌱";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pain": return <Heart className="w-5 h-5" />;
      case "cycle": return <Zap className="w-5 h-5" />;
      case "productivity": return <BookOpen className="w-5 h-5" />;
      case "advocacy": return <Shield className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  if (currentScreen === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-pink-600">Cycle Mastery Quiz</h1>
            <p className="text-lg text-gray-700">
              Test your knowledge about menstrual health, pain normalization, and self-advocacy
            </p>
          </div>

          <div className="space-y-4 bg-pink-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-pink-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              What You'll Learn:
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <span>When period pain needs medical attention vs. what's normal</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <span>How hormones affect your energy, mood, and performance</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>How to advocate for yourself in medical settings</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Cycle syncing and working with your body's natural rhythms</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-700 italic">
              <strong>Remember:</strong> Your feelings are valid, your pain is real, and you deserve 
              healthcare providers who listen. Let's challenge the myths together! 💪
            </p>
          </div>

          <Button 
            onClick={() => setCurrentScreen("game")}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg"
          >
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  if (currentScreen === "game") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8 flex items-center justify-center">
        <Card className="max-w-3xl w-full p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getCategoryIcon(currentQuestion.category)}
              <span className="text-sm font-semibold text-gray-600 capitalize">
                {currentQuestion.category === "pain" && "Pain Awareness"}
                {currentQuestion.category === "cycle" && "Cycle Knowledge"}
                {currentQuestion.category === "productivity" && "Performance & Energy"}
                {currentQuestion.category === "advocacy" && "Self-Advocacy"}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-600">
              Question {currentQuestionIndex + 1} of {menstrualQuestions.length}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.question}</h2>
          </div>

          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswerSelect(true)}
                className="py-8 text-lg bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-300"
                variant="outline"
              >
                <Check className="w-6 h-6 mr-2" />
                True
              </Button>
              <Button
                onClick={() => handleAnswerSelect(false)}
                className="py-8 text-lg bg-red-100 hover:bg-red-200 text-red-800 border-2 border-red-300"
                variant="outline"
              >
                <X className="w-6 h-6 mr-2" />
                False
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg border-2 ${
                selectedAnswer === currentQuestion.answer 
                  ? "bg-green-50 border-green-500" 
                  : "bg-red-50 border-red-500"
              }`}>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  {selectedAnswer === currentQuestion.answer ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-800">Correct!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-600" />
                      <span className="text-red-800">Not quite!</span>
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
              </div>

              <Button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4"
              >
                {currentQuestionIndex < menstrualQuestions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          )}

          <div className="flex justify-center gap-2 pt-4">
            {menstrualQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index < currentQuestionIndex
                    ? "bg-pink-500"
                    : index === currentQuestionIndex
                    ? "bg-pink-300"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8 flex items-center justify-center">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-pink-600">Quiz Complete!</h1>
          <div className="text-6xl font-bold text-purple-600">
            {score}/{menstrualQuestions.length}
          </div>
          <p className="text-xl text-gray-700">{getScoreMessage()}</p>
        </div>

        <div className="space-y-4 bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-pink-800">Uteroo Will Help You:</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
              <span><strong>Track Your Cycle:</strong> Understand patterns and predict symptoms</span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
              <span><strong>Identify Red Flags:</strong> Know when symptoms need medical attention</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <span><strong>Advocate for Yourself:</strong> Build confidence in medical settings</span>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span><strong>Optimize Your Life:</strong> Sync activities with your natural energy</span>
            </li>
          </ul>
        </div>

        <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-500">
          <p className="text-sm text-gray-700">
            <strong>Remember:</strong> You're not alone in this journey. Uteroo is here to help you 
            understand your body, advocate for your health, and thrive throughout your cycle. 💗
          </p>
        </div>

        <Button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg"
        >
          Continue to Uteroo
        </Button>
      </Card>
    </div>
  );
};
