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
  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authError, clearAuthError } = useAuth();

  useEffect(() => {
    console.log('checking session')
    // Check for auth session on page load and handle redirects from OAuth
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (data?.session) {
          console.log('user is already logged in')
          
          // Check if user has a profile to determine if they're new
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error checking profile:', profileError);
          }
          
          // If user has a profile, they've completed onboarding - go to pou-game
          // If no profile, they're a first-time user - show onboarding
          if (profile) {
            console.log('returning user - navigating to pou-game');
            console.log('here is your profile: ');
            console.log(profile);
            navigate("/pou-game");
            toast({
              title: "Welcome back!",
              description: "Ready to play with your companion?"
            });
          } else {
            console.log('first-time user - creating profile and showing onboarding');
            // Create a new profile for the user
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.session.user.id,
                username: `user${data.session.user.id.substring(0, 8)}`,
                full_name: data.session.user.user_metadata?.full_name || '',
              });
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
            } else {
              console.log('Profile created successfully');
            }
            
            setShowOnboarding(true);
          }
        }

        // Check if we're handling an OAuth redirect
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user && window.location.hash.includes("access_token")) {
          // For OAuth users, also check if they're first-time
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();
          
          if (profile) {
            navigate("/pou-game");
          } else {
            // Create profile for OAuth user
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                username: `user${authData.user.id.substring(0, 8)}`,
                full_name: authData.user.user_metadata?.full_name || '',
              });
            
            if (insertError) {
              console.error('Error creating profile for OAuth user:', insertError);
            }
            
            setShowOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setCheckingUser(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/pou-game");
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      clearAuthError();
      setIsLoading(true);
      setLoadingProvider(provider);
      
      // Get the current URL for proper redirect
      const redirectTo = `${window.location.origin}`;
      
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

  // Show loading state while checking user status
  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
