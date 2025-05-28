
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-black relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {authError && (
          <Alert variant="destructive" className="mb-4 bg-white/80 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center space-y-6">
          {/* Character with enhanced styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-20 scale-110"></div>
            <img 
              src="/lovable-uploads/6d9ab694-126c-44a1-9920-f40be00112b1.png"
              alt="Uteroo Character"
              className="w-[400px] h-[400px] object-contain animate-[bounce_3s_ease-in-out_infinite] relative z-10 drop-shadow-2xl"
            />
          </div>
          
          {/* Logo with enhanced styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg filter blur-xl opacity-30"></div>
            <img
              src="/lovable-uploads/790172fa-27b1-4ab3-a3ef-3f10cdac5181.png"
              alt="Uteroo"
              className="h-32 w-auto object-contain relative z-10 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Enhanced tagline */}
        <div className="text-center space-y-2">
          <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed">
            Discover your hormones, moods, and energy
          </p>
          <p className="text-lg font-light text-purple-600">
            in a fun way! ✨
          </p>
        </div>

        {/* Enhanced buttons */}
        <div className="space-y-4 mt-12">
          <div 
            onClick={() => navigate("/pou-game")}
            className="w-full relative cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full filter blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="flex justify-center">
              <Button
                className="relative bg-gradient-to-r from-pink-200 to-purple-200 hover:from-pink-300 hover:to-purple-300 text-gray-800 text-xl font-bold py-6 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/50"
              >
                TRY IT FIRST
              </Button>
            </div>
          </div>

          <div 
            onClick={() => setShowOnboarding(true)}
            className="w-full relative cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="flex justify-center">
              <Button
                className="relative bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-xl font-bold py-6 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                CREATE AN ACCOUNT
              </Button>
            </div>
          </div>

          {/* Enhanced social login section */}
          <div className="relative w-full space-y-4 mt-8">
            <div className="flex justify-center gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30">
              <Button
                variant="outline"
                className="bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 gap-2 rounded-full aspect-square h-16 w-16 flex items-center justify-center p-0 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-gray-200"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                {loadingProvider === 'google' ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-800" />
                ) : (
                  <Icons.google className="h-8 w-8" />
                )}
              </Button>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-[#1877F2] to-[#42A5F5] hover:from-[#1864D9] hover:to-[#1976D2] text-white gap-2 rounded-full aspect-square h-16 w-16 flex items-center justify-center p-0 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-blue-300"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
              >
                {loadingProvider === 'facebook' ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white" />
                ) : (
                  <Icons.facebook className="h-8 w-8" />
                )}
              </Button>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2 opacity-60">
              Dev mode: {window.location.origin}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
