import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface RewardInfo {
  id: number;
  title: string;
  purpose: string;
  ideas: string[];
}

const rewardsData: RewardInfo[] = [
  {
    id: 1,
    title: "Small, Immediate Gratification - Build Momentum",
    purpose: "Provide quick wins to get users excited about the program.",
    ideas: [
      "A small printable calendar or digital tracker to maintain habits",
      "A discount code for a partner wellness brand (e.g., 10% off)",
      "A gratitude journaling prompt bundle or downloadable habit tracker template",
      "Access to a one-time mental health talk or webinar"
    ]
  },
  {
    id: 2,
    title: "Moderate Effort - Build Consistency",
    purpose: "Encourage users to stay consistent with their streaks.",
    ideas: [
      "A physical hobby starter kit (e.g., coloring book and markers, small craft set)",
      "1-month free access to a premium app like a meditation, fitness, or language learning app",
      "A motivational sticker pack or keychain as a reminder of their progress",
      "Access to an exclusive digital reading club session"
    ]
  },
  {
    id: 3,
    title: "High Value - Reward Milestones",
    purpose: "Celebrate bigger accomplishments, such as completing a 30-day streak.",
    ideas: [
      "The \"Big-Ass Calendar\" to track their habits for the next year",
      "A wellness box with self-care items (e.g., skincare products, candles)",
      "A 2-month subscription to comfortable essentials (e.g., underwear or socks)",
      "Access to a live, interactive workshop or community event (e.g., yoga, cooking, mental health awareness)"
    ]
  },
  {
    id: 4,
    title: "Ultimate Prize - Celebrate Long-Term Success",
    purpose: "Mark significant achievements (e.g., maintaining a streak for 60 or 90 days).",
    ideas: [
      "A significant wellness travel discount or gift card for a Mexican retreat",
      "A full wellness kit (e.g., yoga mat, journal, water bottle, and candles)",
      "A 6-month subscription to a premium service (e.g., reading club, meditation app)",
      "A special virtual or in-person event pass (e.g., mental health seminar, book launch)"
    ]
  }
];

const Rewards = () => {
  const navigate = useNavigate();
  const [selectedReward, setSelectedReward] = useState<RewardInfo | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg p-4 shadow-sm">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <Card className="p-6">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">Rewards</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewardsData.map((reward) => (
                <Card 
                  key={reward.id} 
                  className="p-4 flex flex-col items-center space-y-2 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedReward(reward)}
                >
                  <Gift className="w-12 h-12 text-[#FF69B4]" />
                  <h3 className="font-medium">Reward {reward.id}</h3>
                  <p className="text-sm text-gray-600">100 points</p>
                  <Button variant="outline">View Details</Button>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </main>

      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        {selectedReward && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-2">
                Reward {selectedReward.id}: {selectedReward.title}
              </DialogTitle>
              <DialogDescription className="space-y-4">
                <p className="font-medium text-foreground">{selectedReward.purpose}</p>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Possible Rewards:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {selectedReward.ideas.map((idea, index) => (
                      <li key={index} className="text-sm">{idea}</li>
                    ))}
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Rewards;