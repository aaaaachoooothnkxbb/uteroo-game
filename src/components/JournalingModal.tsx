
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Circle, BookOpen, PenLine, Calendar } from "lucide-react";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

interface JournalingModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: Phase;
}

const journalingPrompts: Record<Phase, string[]> = {
  menstruation: [
    "What are my 5 most important values? Is my life, mindset, and daily actions aligned with them?",
    "What's my biggest mistake? What did I learn from it?",
    "What do I need to feel safe? What makes me feel strong and in control of any situation?"
  ],
  follicular: [
    "What gives me the most energy and inspiration?",
    "5 things that would make my life more fulfilled right now. How can I attract them into my life?",
    "What's my deepest desire?"
  ],
  ovulatory: [
    "What kind of impression do I tend to leave on people? Is this the mark I want to leave?",
    "Who are the 5 people I spend most of my time with? How do they make me feel?",
    "How do I express kindness, gratitude, love, and support?"
  ],
  luteal: [
    "What does unconditional love mean to me? Can I love myself and others unconditionally?",
    "What are 5 things I like the most about myself? Why are these my strengths?",
    "What worries me the most in life and why? How can I fix it?"
  ]
};

const phaseDescriptions: Record<Phase, string> = {
  menstruation: "Reflection, Rest, and Release",
  follicular: "New Beginnings, Energy, and Planning",
  ovulatory: "Connection, Confidence, and Communication",
  luteal: "Preparation, Emotional Depth, and Self-Care"
};

export const JournalingModal = ({ isOpen, onClose, phase }: JournalingModalProps) => {
  const [completedPrompts, setCompletedPrompts] = useState<boolean[]>([false, false, false]);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const togglePromptCompletion = (index: number) => {
    const newCompletedPrompts = [...completedPrompts];
    newCompletedPrompts[index] = !newCompletedPrompts[index];
    setCompletedPrompts(newCompletedPrompts);
  };

  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
  };

  const prompts = journalingPrompts[phase];
  const totalCompleted = completedPrompts.filter(Boolean).length;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-6 w-6" /> 
            Daily Journaling - {phaseDescriptions[phase]}
          </DialogTitle>
          <DialogDescription className="text-base">
            Complete these journaling prompts to enhance your self-awareness during this phase.
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="font-medium">Progress:</span>
              <span className="flex items-center gap-1">
                {completedPrompts.map((completed, index) => (
                  completed ? 
                    <CheckCircle key={index} className="h-5 w-5 text-green-500 fill-green-500" /> : 
                    <Circle key={index} className="h-5 w-5 text-gray-300" />
                ))}
              </span>
              <span className="ml-2 text-sm font-medium">
                {totalCompleted}/{prompts.length} completed
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-700 mb-2">How to Journal Effectively:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-blue-700">
              <li>Find a quiet space where you won't be interrupted</li>
              <li>Write freely without judging your thoughts</li>
              <li>Be honest with yourself - this is for your eyes only</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Today's Journaling Prompts:</h3>
            {prompts.map((prompt, index) => (
              <div key={index} className="flex gap-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 pt-0.5">
                  <button 
                    onClick={() => togglePromptCompletion(index)}
                    className="focus:outline-none"
                  >
                    {completedPrompts[index] ? (
                      <CheckCircle className="h-6 w-6 text-green-500 fill-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300" />
                    )}
                  </button>
                </div>
                <div className="flex-grow">
                  <p className={`text-base ${completedPrompts[index] ? 'text-gray-500 line-through' : ''}`}>
                    {prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 p-4 border rounded-lg bg-gray-50">
            <Checkbox 
              id="reminder" 
              checked={reminderEnabled}
              onCheckedChange={toggleReminder}
            />
            <div className="grid gap-1.5">
              <label
                htmlFor="reminder"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable Daily Reminders
              </label>
              <p className="text-sm text-gray-500">
                We'll remind you to journal each day during this phase
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <PenLine className="h-4 w-4" />
            <span>Your answers are saved locally</span>
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
