import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OnboardingFlow from "@/components/OnboardingFlow";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Card className="relative overflow-hidden aspect-square">
            <div className="absolute inset-0 bg-[url('/lovable-uploads/83d631ff-df1a-41d6-a174-1578c2685164.png')] bg-cover bg-center bg-no-repeat hover:scale-105 transition-transform duration-300 flex items-center justify-center rotate-0" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-2xl font-bold">Welcome to the App!</h1>
              <p className="text-gray-600">Get started with your journey.</p>
              <Button onClick={() => navigate("/dashboard")} className="mt-4">
                <ArrowRight className="mr-2" /> Start
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <Button onClick={() => navigate("/yoga")} className="w-full">
              Yoga Game
            </Button>
            <Button onClick={() => navigate("/recipe")} className="w-full">
              Recipe Game
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
