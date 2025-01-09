import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF69B4] to-[#FF1493] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>

        <Card className="p-6">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Your Profile</h1>
              <div className="text-gray-600">
                <p>Total Points: 0</p>
                <p>Achievements: 0</p>
                <p>Days Tracked: 0</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;