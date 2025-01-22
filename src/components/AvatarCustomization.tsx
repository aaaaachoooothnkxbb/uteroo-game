import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AvatarFeatures {
  hair_style: string;
  hair_color: string;
  eye_shape: string;
  eye_color: string;
  skin_tone: string;
  face_features: string[];
  body_type: string;
  posture: string;
  accessories: string[];
  outfit: {
    top: string;
    bottom: string;
    shoes: string;
  };
  background_theme: string;
}

export const AvatarCustomization = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<AvatarFeatures>({
    hair_style: "short",
    hair_color: "#000000",
    eye_shape: "round",
    eye_color: "#000000",
    skin_tone: "#F2D2BD",
    face_features: [],
    body_type: "default",
    posture: "default",
    accessories: [],
    outfit: {
      top: "default",
      bottom: "default",
      shoes: "default"
    },
    background_theme: "default"
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('avatar_customizations')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...features
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your avatar has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save avatar customization.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="outfit">Outfit</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hair Color</Label>
              <input
                type="color"
                value={features.hair_color}
                onChange={(e) => setFeatures(prev => ({...prev, hair_color: e.target.value}))}
                className="w-full h-10 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label>Skin Tone</Label>
              <input
                type="color"
                value={features.skin_tone}
                onChange={(e) => setFeatures(prev => ({...prev, skin_tone: e.target.value}))}
                className="w-full h-10 rounded-md"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="outfit" className="space-y-4">
          {/* Outfit customization options will go here */}
          <p className="text-muted-foreground">Outfit customization coming soon!</p>
        </TabsContent>

        <TabsContent value="accessories" className="space-y-4">
          {/* Accessories customization options will go here */}
          <p className="text-muted-foreground">Accessories customization coming soon!</p>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          {/* Theme customization options will go here */}
          <p className="text-muted-foreground">Theme customization coming soon!</p>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Card>
  );
};