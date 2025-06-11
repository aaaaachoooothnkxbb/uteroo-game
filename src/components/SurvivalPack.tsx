
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurvivalPackProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SurvivalPack = ({ isOpen, onToggle }: SurvivalPackProps) => {
  return (
    <div className="relative">
      {/* Backpack Icon */}
      <div 
        onClick={onToggle}
        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 flex flex-col items-center"
      >
        <div className="text-4xl animate-pulse-slow">🎒</div>
        <span className="text-xs font-semibold text-white bg-black/50 rounded-full px-2 py-0.5 mt-1">
          Survival Pack
        </span>
      </div>

      {/* Backpack Modal/Dropdown */}
      {isOpen && (
        <div className="absolute top-0 left-0 z-50">
          <Card className="w-64 p-4 bg-white/95 backdrop-blur-sm shadow-lg border-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">🎒 Survival Pack</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Your survival tools will appear here!</p>
              <p className="mt-2 text-xs text-gray-500">
                Tools to help you fight enemies in each level coming soon...
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
