import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rewards = () => {
  const navigate = useNavigate();

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
              {[1, 2, 3, 4].map((reward) => (
                <Card key={reward} className="p-4 flex flex-col items-center space-y-2">
                  <Gift className="w-12 h-12 text-[#FF69B4]" />
                  <h3 className="font-medium">Reward {reward}</h3>
                  <p className="text-sm text-gray-600">100 points</p>
                  <Button variant="outline" disabled>Claim</Button>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Rewards;