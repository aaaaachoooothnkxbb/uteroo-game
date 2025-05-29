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
  const [loadingProvider, setLoadingProvider] = useState<'google' | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [isGlowing, setIsGlowing] = useState(false);
  const [characterBouncing, setCharacterBouncing] = useState(false);
  const [nameGlowing, setNameGlowing] = useState(false);
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

  // Add effect to sync glow with bounce animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 600);
    }, 3000); // Match the bounce animation duration

    return () => clearInterval(interval);
  }, []);

  // Add effect for character bouncing and name glowing
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setCharacterBouncing(true);
      // Make the name glow when character reaches the bottom of its bounce
      setTimeout(() => {
        setNameGlowing(true);
      }, 1000); // Halfway through the 2s bounce animation
      
      setTimeout(() => {
        setCharacterBouncing(false);
        setNameGlowing(false);
      }, 2000);
    }, 4000); // Character bounces every 4 seconds

    return () => clearInterval(bounceInterval);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/pou-game");
  };

  const handleSocialLogin = async (provider: 'google') => {
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

        <div className="flex flex-col items-center space-y-2">
          {/* Character with bouncing animation - positioned very close to the name */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-20 scale-110"></div>
            <img 
              src="/lovable-uploads/6d9ab694-126c-44a1-9920-f40be00112b1.png"
              alt="Uteroo Character"
              className={`w-[280px] h-[280px] object-contain drop-shadow-2xl relative z-10 transition-all duration-500 ${
                characterBouncing ? 'animate-bounce' : ''
              }`}
              style={{ animationDuration: characterBouncing ? '2s' : undefined }}
            />
          </div>
          
          {/* Enhanced Uteroo Logo with glow effect - positioned directly below character */}
          <div className={`relative group transition-all duration-600 ${isGlowing || nameGlowing ? 'scale-105' : ''} -mt-60`}>
            {/* Enhanced glow effects when glowing */}
            <div className={`absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-3xl filter blur-2xl transition-all duration-600 scale-110 ${isGlowing || nameGlowing ? 'opacity-80' : 'opacity-40 group-hover:opacity-60'}`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r from-rose-300 to-pink-300 rounded-2xl filter blur-xl transition-all duration-600 ${isGlowing || nameGlowing ? 'opacity-60 animate-pulse' : 'opacity-30 animate-pulse'}`}></div>
            
            {/* Additional intense glow when touching */}
            {(isGlowing || nameGlowing) && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 rounded-3xl filter blur-3xl opacity-60 scale-125 animate-ping"></div>
            )}
            
            {/* Main logo container with glassmorphism */}
            <div className={`relative bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-2xl transition-all duration-600 ${isGlowing || nameGlowing ? 'bg-white/50 shadow-3xl' : ''}`}>
              {/* Enhanced sparkle decorations when glowing */}
              <div className={`absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full transition-all duration-300 ${isGlowing || nameGlowing ? 'animate-bounce opacity-100' : 'animate-ping opacity-75'}`}></div>
              <div className={`absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full transition-all duration-300 ${isGlowing || nameGlowing ? 'animate-bounce opacity-100' : 'animate-pulse'}`}></div>
              <div className={`absolute top-1/2 -right-3 w-2 h-2 bg-purple-400 rounded-full transition-all duration-300 ${isGlowing || nameGlowing ? 'animate-ping opacity-100' : 'animate-bounce'}`}></div>
              
              {/* Enhanced Uteroo text with glow effect */}
              <div className="relative">
                <h1 className={`text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] drop-shadow-lg tracking-wide transition-all duration-600 ${isGlowing || nameGlowing ? 'drop-shadow-2xl filter brightness-125' : ''}`}>
                  Uteroo
                </h1>
                
                {/* Enhanced shadow text for depth */}
                <h1 className={`absolute inset-0 text-6xl font-bold text-purple-200/20 blur-sm transform translate-x-1 translate-y-1 transition-all duration-600 ${isGlowing || nameGlowing ? 'text-yellow-200/40' : ''}`}>
                  Uteroo
                </h1>
                
                {/* Animated underline with glow effect */}
                <div className={`absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center ${isGlowing || nameGlowing ? 'scale-x-100 shadow-lg shadow-pink-400/50' : ''}`}></div>
              </div>
              
              {/* Enhanced floating hearts decoration */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className={`absolute top-4 left-4 text-pink-300 text-sm animate-float opacity-60 transition-all duration-300 ${isGlowing || nameGlowing ? 'text-lg opacity-100' : ''}`}>💕</div>
                <div className={`absolute top-6 right-8 text-purple-300 text-xs animate-float opacity-40 transition-all duration-300 ${isGlowing || nameGlowing ? 'text-sm opacity-80' : ''}`} style={{ animationDelay: '1s' }}>✨</div>
                <div className={`absolute bottom-4 left-8 text-indigo-300 text-sm animate-float opacity-50 transition-all duration-300 ${isGlowing || nameGlowing ? 'text-lg opacity-100' : ''}`} style={{ animationDelay: '2s' }}>🌸</div>
              </div>
            </div>
            
            {/* Enhanced outer glow ring */}
            <div className={`absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-pink-300/50 to-purple-300/50 scale-105 transition-all duration-300 ${isGlowing || nameGlowing ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`}></div>
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
                Demo
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
                GET STARTED
              </Button>
            </div>
          </div>

          {/* Google login button without background container */}
          <div className="relative w-full space-y-4 mt-8">
            <div className="flex justify-center">
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
