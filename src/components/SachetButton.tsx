
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DynamicSachet } from "./DynamicSachet";

interface SachetButtonProps {
  currentPhase?: string;
  currentSymptoms?: string[];
  className?: string;
}

export const SachetButton = ({ 
  currentPhase = "follicular", 
  currentSymptoms = [],
  className = ""
}: SachetButtonProps) => {
  const [isSachetOpen, setIsSachetOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsSachetOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
        size="lg"
      >
        <div className="text-2xl animate-bounce">🎒</div>
      </Button>

      <DynamicSachet
        isOpen={isSachetOpen}
        onClose={() => setIsSachetOpen(false)}
        currentPhase={currentPhase}
        currentSymptoms={currentSymptoms}
      />
    </>
  );
};
