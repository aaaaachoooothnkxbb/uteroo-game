
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

interface ProductivityTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: Phase;
}

const phaseTips = {
  menstruation: {
    title: "Menstruation Flatland (Low Energy, Reflection Phase)",
    hormonalState: [
      "🔻 Low estrogen & progesterone",
      "😴 Fatigue, lower motivation, increased introspection"
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
    title: "Follicular Uphill (High Energy, Planning Phase)",
    hormonalState: [
      "🔺 Rising estrogen, low progesterone",
      "🔥 Increased motivation, energy, and optimism"
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
    title: "Ovulatory Mountain (Peak Social & Execution Phase)",
    hormonalState: [
      "🔝 Peak estrogen & testosterone, progesterone starts rising",
      "💃 Most confident, outgoing, and high-performing phase"
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
    title: "Luteal Hill (Detail-Oriented & Focused Phase)",
    hormonalState: [
      "🔻 Estrogen declines, progesterone peaks, then drops",
      "😤 Increased sensitivity, lower patience, but great for detail work"
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

export const ProductivityTipsModal = ({ isOpen, onClose, phase }: ProductivityTipsModalProps) => {
  const phaseInfo = phaseTips[phase];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">{phaseInfo.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Hormonal State:</h3>
            <ul className="space-y-2">
              {phaseInfo.hormonalState.map((state, index) => (
                <li key={index} className="text-gray-700">{state}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Productivity Tips:</h3>
            <ul className="space-y-2">
              {phaseInfo.tips.map((tip, index) => (
                <li key={index} className="text-gray-700">• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

