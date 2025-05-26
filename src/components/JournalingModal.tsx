
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-white font-light tracking-wide">
            <BookOpen className="h-6 w-6 text-purple-300" /> 
            Daily Journaling - {phaseDescriptions[phase]}
          </DialogTitle>
          <DialogDescription className="text-lg text-white/90 font-light leading-relaxed">
            Complete these journaling prompts to enhance your self-awareness during this phase.
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="font-medium text-purple-200">Progress:</span>
              <span className="flex items-center gap-1">
                {completedPrompts.map((completed, index) => (
                  completed ? 
                    <CheckCircle key={index} className="h-5 w-5 text-emerald-300 fill-emerald-300/80" /> : 
                    <Circle key={index} className="h-5 w-5 text-white/40" />
                ))}
              </span>
              <span className="ml-2 text-sm font-medium text-purple-200 bg-white/10 px-2 py-1 rounded-full">
                {totalCompleted}/{prompts.length} completed
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm p-5 rounded-xl border border-purple-300/20">
            <h3 className="font-medium text-white text-lg mb-3 flex items-center gap-2">
              <PenLine className="h-5 w-5 text-purple-300" />
              How to Journal Effectively:
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-white/90 font-light leading-relaxed">
              <li>Find a quiet space where you won't be interrupted</li>
              <li>Write freely without judging your thoughts</li>
              <li>Be honest with yourself - this is for your eyes only</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-xl text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-300" />
              Today's Journaling Prompts:
            </h3>
            {prompts.map((prompt, index) => (
              <div key={index} className="flex gap-4 p-5 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 pt-1">
                  <button 
                    onClick={() => togglePromptCompletion(index)}
                    className="focus:outline-none hover:scale-110 transition-transform duration-200"
                  >
                    {completedPrompts[index] ? (
                      <CheckCircle className="h-7 w-7 text-emerald-300 fill-emerald-300/80" />
                    ) : (
                      <Circle className="h-7 w-7 text-white/50 hover:text-white/70" />
                    )}
                  </button>
                </div>
                <div className="flex-grow">
                  <p className={`text-base font-light leading-relaxed transition-all duration-300 ${
                    completedPrompts[index] 
                      ? 'text-white/50 line-through' 
                      : 'text-white/95'
                  }`}>
                    {prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 p-5 border border-white/20 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 backdrop-blur-sm">
            <Checkbox 
              id="reminder" 
              checked={reminderEnabled}
              onCheckedChange={toggleReminder}
              className="border-white/40 data-[state=checked]:bg-purple-400/80 data-[state=checked]:border-purple-400 mt-1"
            />
            <div className="grid gap-2">
              <label
                htmlFor="reminder"
                className="text-base font-medium leading-none text-white cursor-pointer"
              >
                Enable Daily Reminders
              </label>
              <p className="text-sm text-white/80 font-light leading-relaxed">
                We'll remind you to journal each day during this phase
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-sm text-white/70 font-light">
            <PenLine className="h-4 w-4 text-purple-300" />
            <span>Your answers are saved locally</span>
          </div>
          <Button 
            onClick={onClose} 
            className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 text-white backdrop-blur-sm border border-white/20 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
