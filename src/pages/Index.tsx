import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/ui/icons";
import { Provider } from "@supabase/supabase-js";
import { useAuth } from "@/components/AuthProvider";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authError, clearAuthError } = useAuth();

  useEffect(() => {
    // Check for auth session on page load and handle redirects from OAuth
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data?.session) {
        // User is already logged in
        navigate("/dashboard");
        toast({
          title: "Welcome back!",
          description: "You are already logged in"
        });
      }

      // Check if we're handling an OAuth redirect
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user && window.location.hash.includes("access_token")) {
        navigate("/dashboard");
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/dashboard");
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      clearAuthError();
      setIsLoading(true);
      setLoadingProvider(provider);
      
      // Get the current URL for proper redirect
      const redirectTo = `${window.location.origin}/pou-game`;
      
      console.log(`Attempting to sign in with ${provider}. Redirect URL: ${redirectTo} window.location: ${window.location.origin}`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Auth error:', error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: error.message
        });
      } else if (!data.url) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Failed to initialize login flow"
        });
      } else {
        console.log(`Auth initialized. Redirecting to: ${data.url}`);
      }
      
      // If we have a URL, we don't need to handle more here since the browser will redirect
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-black relative overflow-hidden bg-white">
      <div className="w-full max-w-md space-y-8 relative z-10">
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center space-y-4">
          <img 
            src="/lovable-uploads/dbcd75af-1cf4-4a08-9b8b-a042e6812749.png"
            alt="Uteroo Character"
            className="w-[500px] h-[500px] object-contain animate-[bounce_2s_ease-in-out_infinite] mt-60"
          />
          <img
            src="/lovable-uploads/790172fa-27b1-4ab3-a3ef-3f10cdac5181.png"
            alt="Uteroo"
            className="h-40 w-auto object-contain"
          />
        </div>

        <p className="text-center text-xl font-medium mt-6 text-gray-700">
          Discover your hormones, moods, and energy in a fun way!
        </p>

        <div className="space-y-4 mt-8">
          <div 
            onClick={() => navigate("/pou-game")}
            className="w-full relative cursor-pointer group"
          >
            <div className="flex justify-center">
              <Button
                className="rounded-full bg-pink-100 text-gray-800 text-2xl font-bold py-5 px-10 hover:scale-105 transition-transform duration-300"
              >
                TRY IT FIRST
              </Button>
            </div>
          </div>

          <div 
            onClick={() => setShowOnboarding(true)}
            className="w-full relative cursor-pointer group"
          >
            <div className="flex justify-center">
              <Button
                className="rounded-full bg-pink-300 text-gray-800 text-2xl font-bold py-5 px-10 hover:scale-105 transition-transform duration-300"
              >
                CREATE AN ACCOUNT
              </Button>
            </div>
          </div>

          <div className="relative w-full space-y-4">
            <div className="flex justify-center gap-3 p-4 bg-pink-100 rounded-full">
              <Button
                variant="outline"
                className="bg-white text-gray-800 hover:bg-gray-100 gap-2 rounded-full aspect-square h-16 w-16 flex items-center justify-center p-0"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                {loadingProvider === 'google' ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-800" />
                ) : (
                  <Icons.google className="h-8 w-8" />
                )}
              </Button>
              <Button
                variant="outline"
                className="bg-[#1877F2] text-white hover:bg-[#1864D9] gap-2 rounded-full aspect-square h-16 w-16 flex items-center justify-center p-0"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
              >
                {loadingProvider === 'facebook' ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                ) : (
                  <Icons.facebook className="h-8 w-8" />
                )}
              </Button>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              In Dev mode: {window.location.origin}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
