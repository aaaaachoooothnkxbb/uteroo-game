import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DailyAffirmation } from "./DailyAffirmation";
import { DailyRecipe } from "./DailyRecipe";
import { YogaPose } from "./YogaPose";
import { Heart, ChefHat, Leaf } from "lucide-react";

interface DailyTasksProps {
  phase: string;
  completedTasks: string[];
  onTaskComplete: (taskType: string) => void;
}

export const DailyTasks = ({ phase, completedTasks, onTaskComplete }: DailyTasksProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>();

  const tasks = [
    {
      id: "affirmation",
      title: "Daily Affirmation",
      icon: Heart,
      color: "text-pink-500",
      component: (
        <DailyAffirmation
          phase={phase}
          onComplete={() => onTaskComplete("affirmation")}
          isCompleted={completedTasks.includes("affirmation")}
        />
      ),
    },
    {
      id: "recipe",
      title: "Daily Recipe",
      icon: ChefHat,
      color: "text-orange-500",
      component: (
        <DailyRecipe
          phase={phase}
          onComplete={() => onTaskComplete("recipe")}
          isCompleted={completedTasks.includes("recipe")}
        />
      ),
    },
    {
      id: "yoga",
      title: "Daily Yoga",
      icon: Leaf,
      color: "text-purple-500",
      component: (
        <YogaPose
          phase={phase}
          onComplete={() => onTaskComplete("yoga")}
          isCompleted={completedTasks.includes("yoga")}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="space-y-4"
      >
        {tasks.map((task) => (
          <AccordionItem
            key={task.id}
            value={task.id}
            className="border rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    completedTasks.includes(task.id)
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  <task.icon
                    className={`w-5 h-5 ${task.color} ${
                      completedTasks.includes(task.id)
                        ? "opacity-50"
                        : "animate-pulse"
                    }`}
                  />
                </div>
                <span className="font-medium">{task.title}</span>
                {completedTasks.includes(task.id) && (
                  <span className="ml-2 text-sm text-green-500">
                    Completed!
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="pt-4">{task.component}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};