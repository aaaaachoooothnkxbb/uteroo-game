
import React, { useState, useEffect } from "react";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AvatarCustomization } from "@/components/AvatarCustomization";

const Profile = () => {
  const { user } = useCustomAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [companionName, setCompanionName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select(`username, full_name, avatar_url, companion_name, user_type, created_at, avatar_animal`)
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data);
          setUsername(data.username || "");
          setCompanionName(data.companion_name || "");
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        id: user?.id,
        username: username,
        companion_name: companionName,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarCustomizationComplete = () => {
    setShowAvatarCustomization(false);
    // Reload profile to get updated avatar data
    if (user) {
      loadProfile();
    }
    toast({
      title: "Avatar updated!",
      description: "Your avatar customization has been saved.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (showAvatarCustomization) {
    return <AvatarCustomization onComplete={handleAvatarCustomizationComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">
                  {profile?.avatar_animal === "Cat" && "🐱"}
                  {profile?.avatar_animal === "Dog" && "🐶"}
                  {profile?.avatar_animal === "Rabbit" && "🐰"}
                  {profile?.avatar_animal === "Fox" && "🦊"}
                  {profile?.avatar_animal === "Bear" && "🐻"}
                  {!profile?.avatar_animal && "👤"}
                </span>
              </div>
              <Button
                onClick={() => setShowAvatarCustomization(true)}
                variant="outline"
                className="mb-4"
              >
                Customize Avatar
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <Label htmlFor="companionName">Companion Name</Label>
                <Input
                  id="companionName"
                  value={companionName}
                  onChange={(e) => setCompanionName(e.target.value)}
                  placeholder="Name your companion"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>User Type:</strong> {profile?.user_type || 'Not classified'}</p>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Member since:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
