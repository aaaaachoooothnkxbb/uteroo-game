import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

type Affirmation = {
  text: string;
  phase: string;
};

const affirmations: Affirmation[] = [
  {
    text: "I honor my body's need for rest today.",
    phase: "menstruation",
  },
  {
    text: "I am energized and ready to take on new challenges.",
    phase: "follicular",
  },
  {
    text: "I radiate confidence and joy.",
    phase: "ovulatory",
  },
  {
    text: "I nurture my body and allow it to recharge.",
    phase: "luteal",
  },
];

export const DailyAffirmation = ({ phase = "menstruation" }) => {
  const affirmation = affirmations.find((a) => a.phase === phase) || affirmations[0];

  return (
    <Card className={`p-6 bg-${phase}-bg border-${phase}-primary max-w-md mx-auto`}>
      <div className="text-center space-y-4">
        <span className="text-4xl animate-float">🌟</span>
        <h3 className="text-xl font-medium">Today's Affirmation</h3>
        <p className={`text-${phase}-primary text-lg font-medium italic`}>
          "{affirmation.text}"
        </p>
        <Button
          variant="outline"
          className={`mt-4 text-${phase}-primary hover:bg-${phase}-light`}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
};