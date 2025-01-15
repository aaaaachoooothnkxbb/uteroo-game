import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
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
      </main>
    </div>
  );
};

export default Settings;