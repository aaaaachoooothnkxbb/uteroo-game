
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
        
        // After successful signup, show questionnaire
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
    try {
      const possibleEmails = [
        `${username}@temp.com`,
        `${username}@uteroo.com`,
        `${username.toLowerCase()}@temp.com`,
        `${username.toLowerCase()}@uteroo.com`,
        username
      ];

      let loginSuccessful = false;

      for (const email of possibleEmails) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (!error && data.user) {
            loginSuccessful = true;
            
            await supabase
              .from('user_login_activities')
              .insert({
                user_id: data.user.id,
                login_timestamp: new Date().toISOString()
              });

            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username, onboarding_completed')
              .eq('id', data.user.id)
              .maybeSingle();
            
            if (!profile && !profileError) {
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
              description: "Login successful! Let's continue with your questionnaire.",
            });
            
            // Always show questionnaire after login
            if (onShowQuestionnaire) {
              onShowQuestionnaire();
            } else {
              onComplete();
            }
            break;
          }
        } catch (err) {
          console.log('Login attempt failed for email:', email);
        }
      }

      if (!loginSuccessful) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password. Please check your credentials and try again.",
        });
      }

    } catch (error) {
      console.error('Login error:', error);
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
        // Google login will redirect, so questionnaire will be handled by the auth state change
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
