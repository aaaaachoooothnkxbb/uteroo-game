
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings as SettingsIcon, Upload, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast({
            title: "Authentication Error",
            description: "Please sign in to access this page",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setUserId(user.id);

        // Fetch existing profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setUsername(profileData.username || "");
          setFullName(profileData.full_name || "");
          setAvatarUrl(profileData.avatar_url);
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, [navigate, toast]);

  const handleProfileUpdate = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "Please sign in to upload a profile picture",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      toast({
        title: "Success!",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg p-4 shadow-sm">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Button>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-6 h-6" />
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>

              {/* Profile Picture Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Profile Picture</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <label 
                      htmlFor="profile-upload" 
                      className="absolute bottom-0 right-0 p-1 bg-primary hover:bg-primary/90 rounded-full cursor-pointer text-white"
                    >
                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Profile Details</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <Button onClick={handleProfileUpdate}>
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* General Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">General Settings</h2>
                <div className="space-y-2">
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
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
