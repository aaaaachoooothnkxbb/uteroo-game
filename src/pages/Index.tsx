import { useState, useEffect } from "react";
import { AccountCreation } from "@/components/AccountCreation";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useAuth } from "@/components/AuthProvider";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { CycleSanctuary } from "@/components/CycleSanctuary";
import { useCycleTracking } from "@/hooks/useCycleTracking";

type CyclePhase = "menstruation" | "follicular" | "ovulatory" | "luteal";

const Index = () => {
  const { user, isLoading } = useAuth();
  const { checkQuestionnaireDue } = useQuestionnaire();
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireCheckComplete, setQuestionnaireCheckComplete] = useState(false);
  
  // Use cycle tracking to get current phase
  const { getCurrentPhase } = useCycleTracking();
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>(getCurrentPhase());

  // Update phase when cycle tracking changes
  useEffect(() => {
    setCurrentPhase(getCurrentPhase());
  }, [getCurrentPhase]);

  // Check if questionnaire is due when user is authenticated
  useEffect(() => {
    const checkQuestionnaireStatus = async () => {
      if (user && !questionnaireCheckComplete) {
        const isDue = await checkQuestionnaireDue(user.id);
        console.log('Questionnaire due check:', isDue);
        
        if (isDue) {
          setShowQuestionnaire(true);
        }
        setQuestionnaireCheckComplete(true);
      }
    };

    if (!isLoading) {
      checkQuestionnaireStatus();
    }
  }, [user, isLoading, checkQuestionnaireDue, questionnaireCheckComplete]);

  // Show account creation for non-authenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      setShowAccountCreation(true);
    }
  }, [user, isLoading]);

  const handleAccountCreationComplete = () => {
    setShowAccountCreation(false);
    // After account creation, the auth state will change and trigger questionnaire check
  };

  const handleShowQuestionnaire = () => {
    setShowAccountCreation(false);
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setQuestionnaireCheckComplete(true);
  };

  const handlePhaseChange = (phase: CyclePhase) => {
    setCurrentPhase(phase);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show account creation for non-authenticated users
  if (showAccountCreation && !user) {
    return (
      <AccountCreation 
        onComplete={handleAccountCreationComplete}
        onShowQuestionnaire={handleShowQuestionnaire}
      />
    );
  }

  // Show questionnaire if due or for new users
  if (showQuestionnaire && user) {
    return <OnboardingFlow onComplete={handleQuestionnaireComplete} />;
  }

  // Show main app for authenticated users with completed/up-to-date questionnaire
  if (user && questionnaireCheckComplete && !showQuestionnaire) {
    return <CycleSanctuary currentPhase={currentPhase} onPhaseChange={handlePhaseChange} />;
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Setting up your experience...</p>
      </div>
    </div>
  );
};

export default Index;
