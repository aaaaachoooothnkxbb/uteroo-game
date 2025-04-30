
import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti';

type TutorialStep = {
  title: string;
  content: React.ReactNode;
  highlightSelector?: string;
};

export const UterooTutorial = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome!",
      content: (
        <div>
          <p className="text-lg mb-4">
            Hey there, friend! 👋 I'm Uteroo, your hormonal cycle companion! 
          </p>
          <p>
            Think of me as your guide through the ups and downs of your period journey. 
            Let's explore how I can help you feel your best—ready?
          </p>
        </div>
      )
    },
    {
      title: "The 4 Levels (Hormonal Phases)",
      content: (
        <div>
          <p className="text-lg mb-4">
            See these four doors? 🚪 Each represents a phase of your cycle!
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Level 1: Menstruation</strong> – Rest and recharge.</li>
            <li><strong>Level 2: Follicular</strong> – Energy is rising!</li>
            <li><strong>Level 3: Ovulatory</strong> – Confidence boost!</li>
            <li><strong>Level 4: Luteal</strong> – Cozy vibes.</li>
          </ul>
          <p className="mt-2">Tap any to see what's happening in your body <em>right now</em>!</p>
        </div>
      ),
      highlightSelector: ".phase-buttons"
    },
    {
      title: "The Streak & Needs Bars",
      content: (
        <div>
          <p className="text-lg mb-4">
            This flame? 🔥 That's your <em>streak</em>—the more you check in, the brighter it burns!
          </p>
          <p>And these bars? They're your <em>needs</em>:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Health</strong> (🍎): Move gently!</li>
            <li><strong>Hydration</strong> (💧): Drink water, love!</li>
            <li><strong>Energy</strong> (⚡): Rest or stretch?</li>
            <li><strong>Affective</strong> (💖): Hugs, journaling, or calling a friend?</li>
          </ul>
          <p className="mt-2">When bars dip, I'll suggest <em>boosters</em> to fill them up!</p>
        </div>
      ),
      highlightSelector: ".stats-bars"
    },
    {
      title: "Rooms & Mood Boosters",
      content: (
        <div>
          <p className="text-lg mb-4">
            Time to explore your <em>7 magical rooms</em>! Each is full of boosters tailored to your phase:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Bedroom</strong> 🛏️: Cozy blankets, naps, or journaling.</li>
            <li><strong>Bathroom</strong> 🛁: Warm baths, skincare, or hydration reminders.</li>
            <li><strong>Kitchen</strong> 🍽️: Healthy snacks and nutrition.</li>
            <li><strong>Exercise Room</strong> 🧘: Gentle yoga or energizing workouts.</li>
            <li><strong>Game Room</strong> 🎮: Fun breaks, creativity, or silly dances!</li>
            <li><strong>Work Station</strong> 💼: Focus tips, productivity hacks.</li>
            <li><strong>Shop</strong> 🛒: Retail therapy (virtual boosts!).</li>
            <li><strong>Lab</strong> 🔬: Track symptoms or learn cycle science!</li>
          </ul>
          <p className="mt-2">Tap a room to find <em>your</em> perfect booster!</p>
        </div>
      ),
      highlightSelector: ".room-navigation"
    },
    {
      title: "Enemies (Symptoms & Challenges)",
      content: (
        <div>
          <p className="text-lg mb-4">
            Uh-oh! 👻 These <em>enemies</em> represent tough symptoms. But don't worry—boosters weaken them!
          </p>
          <p>For example:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cramp Monster</strong>? Try the <em>Bathroom's</em> heating pad booster!</li>
            <li><strong>Anxiety Goblin</strong>? The <em>Game Room's</em> fun break!</li>
            <li><strong>Fatigue Ghost</strong>? Visit the <em>Kitchen</em> for energy snacks!</li>
            <li><strong>Irritability</strong>? Use the <em>Bedroom's</em> journaling!</li>
          </ul>
          <p className="mt-2">When an enemy vanishes, tap ✅ to celebrate your win!</p>
        </div>
      ),
      highlightSelector: ".enemies-section"
    },
    {
      title: "Boosters (Real-Life Activities)",
      content: (
        <div>
          <p className="text-lg mb-4">
            These magic boosters ✨ are <em>real actions</em> to help you feel better!
          </p>
          <p>
            Tap one (like 'Drink Water' in the <em>Bathroom</em> or 'Yoga Session' in the <em>Exercise Room</em>) 
            and I'll cheer you on. Pro tip: Doing them IRL makes enemies <em>and</em> bad habits disappear faster!
          </p>
        </div>
      ),
      highlightSelector: ".boosters-section"
    },
    {
      title: "General Recommendations",
      content: (
        <div>
          <p className="text-lg mb-4">
            This is your phase's <em>cheat code</em>! 🎮
          </p>
          <p>
            Follow it to keep needs met and enemies tiny. 
            For example, hydration = fewer headaches!
          </p>
        </div>
      )
    },
    {
      title: "Back to Menu",
      content: (
        <div>
          <p className="text-lg mb-4">
            All done exploring? This button takes you home 🏡
          </p>
          <p>
            But come back anytime! I'll update your needs and enemies as your cycle changes.
          </p>
        </div>
      ),
      highlightSelector: ".back-button"
    },
    {
      title: "You've Got This!",
      content: (
        <div>
          <p className="text-lg mb-4">
            You've got this, warrior! 💪
          </p>
          <p>
            Every booster you use, every enemy you defeat—you're learning to <em>thrive</em> in your cycle. 
            Now, let's make today feel a little brighter!
          </p>
          <p className="mt-4 font-bold text-center text-purple-600">
            🎉 You earned 50 points for completing the tutorial! 🎉
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - trigger confetti and close
      triggerConfetti();
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white rounded-xl overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{currentTutorialStep.title}</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="py-2">
            {currentTutorialStep.content}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleNext} className="px-6">
              {currentStep < tutorialSteps.length - 1 ? (
                <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
              ) : (
                'Finish'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
