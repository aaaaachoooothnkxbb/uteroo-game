
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseAuthProps {
  onComplete: () => void;
  onShowQuestionnaire?: () => void;
}

export const useAuth = ({ onComplete, onShowQuestionnaire }: UseAuthProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | null>(null);
  const { toast } = useToast();

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
      const email = username.includes('@') ? username : `${username}@temp.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Account creation failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to Uteroo!",
        });
        
        // New users always need to complete questionnaire
        if (onShowQuestionnaire) {
          onShowQuestionnaire();
        } else {
          onComplete();
        }
      }
    } catch (error) {
      console.error('Account creation error:', error);
      toast({
        variant: "destructive",
        title: "Account creation failed",
        description: "An unexpected error occurred.",
      });
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
    console.log('Starting login process for username:', username);
    
    try {
      // Try the exact username first if it looks like an email
      let loginEmail = username;
      
      // If it doesn't contain @, try the temp.com format
      if (!username.includes('@')) {
        loginEmail = `${username}@temp.com`;
      }

      console.log('Attempting login with email:', loginEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Email not confirmed')) {
          toast({
            variant: "destructive",
            title: "Email not confirmed",
            description: "Please check your email and confirm your account before logging in.",
          });
        } else if (error.message.includes('Invalid login credentials')) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid username or password. Please check your credentials.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message,
          });
        }
        return;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        
        // Log the login activity
        try {
          await supabase
            .from('user_login_activities')
            .insert({
              user_id: data.user.id,
              login_timestamp: new Date().toISOString()
            });
        } catch (logError) {
          console.error('Failed to log login activity:', logError);
        }

        // Check user profile and questionnaire status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, onboarding_completed, questionnaire_due_date')
          .eq('id', data.user.id)
          .maybeSingle();
        
        console.log('Profile data:', profile);

        // Create profile if it doesn't exist
        if (!profile && !profileError) {
          console.log('Creating new profile for user');
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username,
              full_name: data.user.user_metadata?.full_name || '',
              onboarding_completed: false
            });
        }

        toast({
          title: `Welcome back ${username}!`,
          description: "Login successful!",
        });
        
        // Always show questionnaire for new users or if onboarding not completed
        // Also show if questionnaire is due (every 10 days)
        const needsQuestionnaire = !profile?.onboarding_completed || 
          (profile?.questionnaire_due_date && new Date() >= new Date(profile.questionnaire_due_date));
        
        console.log('Needs questionnaire:', needsQuestionnaire);
        console.log('Onboarding completed:', profile?.onboarding_completed);
        console.log('Questionnaire due date:', profile?.questionnaire_due_date);
        
        if (needsQuestionnaire && onShowQuestionnaire) {
          console.log('Showing questionnaire');
          onShowQuestionnaire();
        } else {
          console.log('Completing login without questionnaire');
          onComplete();
        }
      }

    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred during login.",
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingProvider('google');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Google sign-in failed",
          description: error.message,
        });
      } else {
        // Google login will redirect, questionnaire check will happen after auth state change
        if (onShowQuestionnaire) {
          onShowQuestionnaire();
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Google sign-in failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    username,
    password,
    isLoading,
    isLoginLoading,
    loadingProvider,
    setUsername,
    setPassword,
    handleSave,
    handleLogin,
    handleGoogleLogin,
  };
};
