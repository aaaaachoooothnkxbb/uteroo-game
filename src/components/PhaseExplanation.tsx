import { Card } from "@/components/ui/card";

type Phase = {
  name: string;
  description: string;
  mood: string;
  color: string;
};

const phases: Phase[] = [
  {
    name: "Menstruation Flatland",
    description: "Low estrogen and progesterone → rest and self-care",
    mood: "Low energy, introspective",
    color: "menstruation",
  },
  {
    name: "Follicular Uphill",
    description: "Rising estrogen → increased energy and creativity",
    mood: "Optimistic, motivated",
    color: "follicular",
  },
  {
    name: "Ovulatory Mountain",
    description: "Peak estrogen and luteinizing hormone → confidence and social energy",
    mood: "Sociable, confident",
    color: "ovulatory",
  },
  {
    name: "Luteal Hill",
    description: "Fluctuating hormones → mood swings, cravings",
    mood: "Sensitive, irritable",
    color: "luteal",
  },
];

export const PhaseExplanation = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {phases.map((phase) => (
        <Card
          key={phase.name}
          className={`p-6 bg-${phase.color}-bg border-${phase.color}-primary hover:scale-105 transition-transform duration-300`}
        >
          <h3 className={`text-xl font-bold mb-2 text-${phase.color}-primary`}>
            {phase.name}
          </h3>
          <p className="text-gray-600 mb-4">{phase.description}</p>
          <div className={`text-sm p-2 rounded-md bg-${phase.color}-light`}>
            <strong>Mood:</strong> {phase.mood}
          </div>
        </Card>
      ))}
    </div>
  );
};