import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/ui/icons";
import { Provider } from "@supabase/supabase-js";
import { useAuth } from "@/components/AuthProvider";
import { AlertCircle, BarChart3, Smile, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [primaryButtonText, setPrimaryButtonText] = useState("EXPLORE DEMO");
  const [primaryButtonClicked, setPrimaryButtonClicked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authError, clearAuthError } = useAuth();

  useEffect(() => {
    console.log('checking session')
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (data?.session) {
          console.log('user is already logged in')
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error checking profile:', profileError);
          }
          
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

        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user && window.location.hash.includes("access_token")) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();
          
          if (profile) {
            navigate("/pou-game");
          } else {
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

  const handlePrimaryClick = () => {
    if (!primaryButtonClicked) {
      setPrimaryButtonText("Let's Go!");
      setPrimaryButtonClicked(true);
      setTimeout(() => {
        navigate("/pou-game");
      }, 800);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    try {
      clearAuthError();
      setIsLoading(true);
      setLoadingProvider(provider);
      
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

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 animate-gradient">
        {/* Floating background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300/30 rounded-full animate-gentle-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-purple-300/30 rounded-full animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-300/20 rounded-full animate-gentle-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-pink-400/25 rounded-full animate-gentle-float" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-400/20 rounded-full animate-gentle-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-indigo-400/30 rounded-full animate-gentle-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 text-black">
        {/* Error Alert */}
        {authError && (
          <Alert variant="destructive" className="mb-4 bg-white/80 backdrop-blur-sm max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {/* Main Content Container */}
        <div className="content w-full max-w-sm space-y-6 relative">
          {/* Title and Large Bouncing Character */}
          <div className="text-center space-y-2 relative">
            <h1 className="text-4xl font-extrabold text-purple-700 tracking-wide relative z-10 mt-20">
              Uteroo
            </h1>
            
            {/* Large bouncing Uteroo character positioned over the title */}
            <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20">
              <div className="relative">
                <div className="w-40 h-40 bg-white/40 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center border-4 border-white/60 animate-bounce-slow">
                  <img 
                    src="/lovable-uploads/50167af2-3f66-47c1-aadb-96e97717d531.png"
                    alt="Happy Uteroo Character"
                    className="w-32 h-32 object-contain"
                  />
                </div>
                {/* Enhanced elevation shadow */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-40 scale-110 -z-10 animate-pulse"></div>
              </div>
            </div>
            
            <p className="text-lg text-gray-800 font-medium leading-relaxed mt-4">
              Master your cycle with playful hormone tracking
            </p>
          </div>

          {/* Hormone Cycle Animation */}
          <div className="cycle-animation relative h-16 flex items-center justify-center my-6">
            <div className="relative w-48 h-12">
              {/* Estrogen dot */}
              <div className="absolute w-4 h-4 bg-pink-400 rounded-full animate-staggered-float opacity-80" style={{ left: '10%', animationDelay: '0s' }}></div>
              {/* Progesterone dot */}
              <div className="absolute w-4 h-4 bg-purple-500 rounded-full animate-staggered-float opacity-80" style={{ left: '30%', animationDelay: '2s' }}></div>
              {/* LH dot */}
              <div className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-staggered-float opacity-80" style={{ left: '50%', animationDelay: '4s' }}></div>
              {/* FSH dot */}
              <div className="absolute w-4 h-4 bg-green-400 rounded-full animate-staggered-float opacity-80" style={{ left: '70%', animationDelay: '6s' }}></div>
            </div>
          </div>

          {/* Benefit Cards */}
          <div className="benefits grid grid-cols-3 gap-3 my-6">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Hormone Tracking</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Smile className="h-5 w-5 text-pink-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Mood Insights</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">Energy Guide</p>
            </div>
          </div>

          {/* Abstract App Preview */}
          <div className="app-preview flex justify-center my-4">
            <div className="w-48 h-24 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-3 left-3 w-12 h-3 bg-white/40 rounded-md"></div>
              <div className="absolute top-8 left-3 w-16 h-3 bg-white/30 rounded-md"></div>
              <div className="absolute top-13 left-3 w-14 h-3 bg-white/50 rounded-md"></div>
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-3 left-3 right-3 h-4 bg-white/20 rounded-lg"></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="buttons space-y-3">
            <Button
              onClick={handlePrimaryClick}
              className={`w-full py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                primaryButtonClicked 
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600' 
                  : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600'
              } text-white border-0`}
              style={{ transform: primaryButtonClicked ? 'translateY(-3px)' : 'none' }}
            >
              {primaryButtonText}
            </Button>

            <Button
              onClick={() => setShowOnboarding(true)}
              variant="outline"
              className="w-full py-4 text-lg font-bold rounded-full border-2 border-purple-500 text-purple-700 bg-white/60 hover:bg-white/80 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              CREATE ACCOUNT
            </Button>

            {/* Google login button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="bg-white/60 hover:bg-white/80 text-gray-800 hover:text-gray-900 gap-2 rounded-full aspect-square h-12 w-12 flex items-center justify-center p-0 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-300"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                {loadingProvider === 'google' ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-800" />
                ) : (
                  <Icons.google className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Proof Footer */}
          <div className="footer-text text-center mt-6">
            <p className="text-sm text-gray-700 font-medium">
              Join 250k+ people mastering their cycles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
