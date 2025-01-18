import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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

const hormoneData = [
  { day: 1, estrogen: 20, fsh: 15, progesterone: 5 },
  { day: 7, estrogen: 30, fsh: 25, progesterone: 5 },
  { day: 14, estrogen: 90, fsh: 45, progesterone: 10 },
  { day: 21, estrogen: 40, fsh: 15, progesterone: 80 },
  { day: 28, estrogen: 20, fsh: 15, progesterone: 10 },
];

export const PhaseExplanation = () => {
  return (
    <div className="space-y-8 p-4">
      <div className="w-full overflow-x-auto">
        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Hormone Levels Throughout Your Cycle</h2>
          <LineChart
            width={800}
            height={400}
            data={hormoneData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" label={{ value: 'Day of Cycle', position: 'bottom' }} />
            <YAxis label={{ value: 'Hormone Levels', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="estrogen"
              stroke="#FF69B4"
              name="Estrogen"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="fsh"
              stroke="#4169E1"
              name="FSH"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="progesterone"
              stroke="#FF1493"
              name="Progesterone"
              strokeWidth={2}
            />
          </LineChart>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase) => (
          <Card
            key={phase.name}
            className={`p-6 bg-${phase.color}-bg/95 backdrop-blur-sm border-${phase.color}-primary hover:scale-105 transition-transform duration-300 shadow-lg`}
          >
            <h3 className={`text-xl font-bold mb-2 text-${phase.color}-primary`}>
              {phase.name}
            </h3>
            <p className="text-gray-800 font-medium mb-4">{phase.description}</p>
            <div className={`text-sm p-2 rounded-md bg-${phase.color}-light/90 text-gray-800 font-medium`}>
              <strong>Mood:</strong> {phase.mood}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};