
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhaseProductivityTips {
  [key: string]: {
    hormonalState: string[];
    tips: string[];
  };
}

const phaseProductivityTips: PhaseProductivityTips = {
  menstruation: {
    hormonalState: [
      "Low estrogen & progesterone",
      "Fatigue, lower motivation, increased introspection"
    ],
    tips: [
      "Prioritize deep rest & recovery 🛌",
      "Focus on reflection & journaling 📝",
      "Tackle low-energy tasks (admin work, organizing, light planning)",
      "Say no to draining social interactions 🙅‍♀️",
      "Engage in creative thinking (brainstorming, vision boarding)",
      "Use warm drinks, cozy settings to stay comfortable ☕"
    ]
  },
  follicular: {
    hormonalState: [
      "Rising estrogen, low progesterone",
      "Increased motivation, energy, and optimism"
    ],
    tips: [
      "Tackle high-energy, creative tasks 🎨 (problem-solving, strategic planning)",
      "Start new projects 🚀 (best time for brainstorming & innovation)",
      "Network & collaborate 🤝 (social confidence is high)",
      "Exercise in the morning to enhance focus 🏃‍♀️",
      "Optimize your workspace for productivity (declutter, add light)"
    ]
  },
  ovulatory: {
    hormonalState: [
      "Peak estrogen & testosterone, progesterone starts rising",
      "Most confident, outgoing, and high-performing phase"
    ],
    tips: [
      "Schedule important meetings & presentations 🎤 (communication skills shine)",
      "Tackle high-impact, visibility tasks (leadership, negotiations)",
      "Batch work that requires multitasking (brain is most efficient)",
      "Engage in team collaboration & networking 🤝",
      "Stay hydrated & take breaks to manage high energy levels"
    ]
  },
  luteal: {
    hormonalState: [
      "Estrogen declines, progesterone peaks, then drops",
      "Increased sensitivity, lower patience, but great for detail work"
    ],
    tips: [
      "Tackle deep work & analytical tasks 🔬 (editing, troubleshooting, coding)",
      "Complete lingering to-dos (focus is strong but patience is low)",
      "Avoid overloading your schedule (energy declines toward the end)",
      "Break work into smaller, manageable chunks",
      "Use grounding techniques (breathing exercises, short walks) 🚶‍♀️"
    ]
  }
};

interface ProductivityTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: string;
}

export const ProductivityTipsModal = ({ isOpen, onClose, phase }: ProductivityTipsModalProps) => {
  const tips = phaseProductivityTips[phase];

  if (!tips) return null;

  const phaseTitles = {
    menstruation: "Menstruation Flatland (Low Energy, Reflection Phase)",
    follicular: "Follicular Uphill (High Energy, Planning Phase)",
    ovulatory: "Ovulatory Mountain (Peak Social & Execution Phase)",
    luteal: "Luteal Hill (Detail-Oriented & Focused Phase)"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {phaseTitles[phase as keyof typeof phaseTitles]}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Hormonal State:</h3>
              <ul className="list-disc list-inside space-y-1">
                {tips.hormonalState.map((state, index) => (
                  <li key={index} className="text-gray-700">{state}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Productivity Tips:</h3>
              <ul className="list-disc list-inside space-y-2">
                {tips.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
