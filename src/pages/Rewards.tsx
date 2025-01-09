import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rewards = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF69B4] to-[#FF1493] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>

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
      </div>
    </div>
  );
};

export default Rewards;