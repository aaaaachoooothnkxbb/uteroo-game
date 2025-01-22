import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AvatarCustomization } from "@/components/AvatarCustomization";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const userId = (await supabase.auth.getUser()).data.user?.id;
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
      toast({
        title: "Error",
        description: error.message,
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
            <div className="text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
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
                  <Upload className="w-5 h-5" />
                </label>
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

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Customize Your Avatar</h2>
            <AvatarCustomization />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;