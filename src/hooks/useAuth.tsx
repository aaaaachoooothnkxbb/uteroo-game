
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface UseAuthProps {
  onComplete: () => void;
  onShowQuestionnaire?: () => void;
}

export const useAuth = ({ onComplete, onShowQuestionnaire }: UseAuthProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { toast } = useToast();
  const { login, signup } = useCustomAuth();

  const handleSave = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both username and password.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(username, password);
      if (success) {
        // New users always need to complete questionnaire
        if (onShowQuestionnaire) {
          onShowQuestionnaire();
        } else {
          onComplete();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both username and password.",
      });
      return;
    }

    setIsLoginLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        // For existing users, we'll check if they need questionnaire in the main flow
        onComplete();
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    toast({
      variant: "destructive",
      title: "Google login unavailable",
      description: "Please use username and password login.",
    });
  };

  return {
    username,
    password,
    isLoading,
    isLoginLoading,
    loadingProvider: null,
    setUsername,
    setPassword,
    handleSave,
    handleLogin,
    handleGoogleLogin,
  };
};
