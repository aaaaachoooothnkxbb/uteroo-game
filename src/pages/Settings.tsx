import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF69B4] to-[#FF1493] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Account
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Help & Support
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;