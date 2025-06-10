
import { useState } from "react";
import { PreQuestionnaire } from "./PreQuestionnaire";
import { CompanionNaming } from "./CompanionNaming";
import { AvatarCreation } from "./AvatarCreation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { AvatarOptions } from "@/types/avatar";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState("pre-questionnaire");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<AvatarOptions | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePreQuestionnaireComplete = (username: string) => {
    console.log('Pre-questionnaire completed:', { username });
    setUsername(username);
    setCurrentStep("avatar-creation");
  };

  const handleAvatarCreated = async (avatarData: AvatarOptions) => {
    console.log('Avatar created:', avatarData);
    setAvatar(avatarData);
    
    // Save avatar data to database immediately
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: username,
            avatar_animal: avatarData.animal,
            avatar_color: avatarData.color,
            avatar_accessory: avatarData.accessory,
          });

        if (error) {
          console.error('Error saving avatar:', error);
          toast({
            title: "Error saving avatar",
            description: "Please try again",
            variant: "destructive",
          });
          return;
        }
        
        console.log('Avatar saved successfully to database');
      } catch (error) {
        console.error('Unexpected error saving avatar:', error);
        toast({
          title: "Unexpected error",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCurrentStep("companion-naming");
  };

  const handleCompanionNamingComplete = (companionName: string) => {
    console.log('Companion naming completed, calling onComplete:', companionName);
    toast({
      title: "Welcome to Uteroo!",
      description: `You and ${companionName} are ready to start your journey!`,
    });
    onComplete();
  };

  if (currentStep === "pre-questionnaire") {
    return <PreQuestionnaire onComplete={handlePreQuestionnaireComplete} />;
  }

  if (currentStep === "avatar-creation") {
    return <AvatarCreation onAvatarCreate={handleAvatarCreated} />;
  }

  if (currentStep === "companion-naming") {
    return <CompanionNaming onComplete={handleCompanionNamingComplete} />;
  }

  return null;
};
