import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@dicebear/react";
import * as dicebear from "@dicebear/avatars";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SachetButton } from "@/components/SachetButton";

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [avatarDetails, setAvatarDetails] = useState<{
    animal: string | null;
    color: string | null;
    accessory: string | null;
  }>({
    animal: null,
    color: null,
    accessory: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("username, avatar_animal, avatar_color, avatar_accessory")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              title: "Error fetching profile",
              description: "Failed to load your profile data.",
              variant: "destructive",
            });
          }

          if (data) {
            setUsername(data.username);
            setAvatarDetails({
              animal: data.avatar_animal,
              color: data.avatar_color,
              accessory: data.avatar_accessory,
            });
          }
        }
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        toast({
          title: "Unexpected error",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleEditProfile = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100">
      <div className="container mx-auto p-8">
        <Card className="bg-white/80 backdrop-blur-lg shadow-xl rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar and Welcome Section */}
            <div className="flex flex-col items-center justify-center">
              {isLoading ? (
                <Skeleton className="w-32 h-32 rounded-full mb-4" />
              ) : (
                <Avatar
                  style={{ width: "8rem", height: "8rem" }}
                  seed={`${username}-${avatarDetails.animal}-${avatarDetails.color}-${avatarDetails.accessory}`}
                  options={{
                    backgroundColor: [
                      avatarDetails.color || "#f4f4f4",
                    ],
                  }}
                  generator={dicebear.pixelArt}
                />
              )}
              {isLoading ? (
                <Skeleton className="h-8 w-48 mb-2" />
              ) : (
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  Welcome, {username}!
                </h1>
              )}
              {isLoading ? (
                <Skeleton className="h-6 w-64 mb-4" />
              ) : (
                <p className="text-gray-600 text-center">
                  Here's your personalized dashboard. Edit your profile to
                  customize your experience.
                </p>
              )}
              <Button onClick={handleEditProfile} disabled={isLoading}>
                Edit Profile
              </Button>
            </div>

            {/* Quick Access Links */}
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Quick Access
              </h2>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full">
                  View Cycle Analysis
                </Button>
                <Button variant="secondary" className="w-full">
                  Explore Wellness Tips
                </Button>
                <Button variant="secondary" className="w-full">
                  Connect with Community
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Content Area */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-lg shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Today's Focus
            </h2>
            <p className="text-gray-600">
              Check out our curated content for today, designed to align with
              your current cycle phase.
            </p>
          </Card>
        </div>
      </div>

      {/* Sachet Button - Always accessible */}
      <SachetButton />
    </div>
  );
};

export default Dashboard;
