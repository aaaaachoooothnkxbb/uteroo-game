
import { useState } from "react";
import { PreQuestionnaire } from "./PreQuestionnaire";
import { CompanionNaming } from "./CompanionNaming";
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

  const handlePreQuestionnaireComplete = async (username: string, avatar: AvatarOptions) => {
    console.log('Pre-questionnaire completed:', { username, avatar });
    
    setUsername(username);
    setAvatar(avatar);
    
    // Save to database
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            username: username,
            avatar_animal: avatar.animal,
            avatar_color: avatar.color,
            avatar_accessory: avatar.accessory,
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error saving profile:', error);
          toast({
            title: "Error saving profile",
            description: "Please try again",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error('Unexpected error:', error);
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

  if (currentStep === "companion-naming") {
    return <CompanionNaming onComplete={handleCompanionNamingComplete} />;
  }

  return null;
};
