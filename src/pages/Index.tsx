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
    <div className="welcome-container min-h-screen flex flex-col items-center justify-center p-6 text-black relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 animate-gradient">
      {/* Header decoration with floating animation */}
      <div className="header-decoration absolute top-0 left-0 w-full h-32 overflow-hidden">
        <div className="absolute top-8 left-1/4 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-12 right-1/3 w-16 h-16 bg-purple-300 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-6 right-1/4 w-12 h-12 bg-indigo-300 rounded-full opacity-35 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Error Alert */}
      {authError && (
        <Alert variant="destructive" className="mb-4 bg-white/80 backdrop-blur-sm max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      {/* Main Content Container */}
      <div className="content w-full max-w-md space-y-8 relative z-10">
        {/* App Logo with enhanced circular container */}
        <div className="app-logo flex justify-center mb-20">
          <div className="relative">
            <div className="w-[120px] h-[120px] bg-white/40 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center border-4 border-white/60">
              <img 
                src="/lovable-uploads/6d9ab694-126c-44a1-9920-f40be00112b1.png"
                alt="Uteroo Character"
                className="w-20 h-20 object-contain"
              />
            </div>
            {/* Elevation shadow */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-30 scale-110 -z-10"></div>
          </div>
        </div>

        {/* Title and Tagline */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-purple-700 tracking-wide">
            Uteroo
          </h1>
          <p className="text-xl text-gray-800 font-medium leading-relaxed">
            Master your cycle with playful hormone tracking
          </p>
        </div>

        {/* Hormone Cycle Animation */}
        <div className="cycle-animation relative h-24 flex items-center justify-center my-8">
          <div className="relative w-64 h-16">
            {/* Estrogen dot */}
            <div className="absolute w-5 h-5 bg-pink-400 rounded-full animate-float opacity-80" style={{ left: '10%', animationDelay: '0s', animationDuration: '8s' }}></div>
            {/* Progesterone dot */}
            <div className="absolute w-5 h-5 bg-purple-500 rounded-full animate-float opacity-80" style={{ left: '30%', animationDelay: '2s', animationDuration: '8s' }}></div>
            {/* LH dot */}
            <div className="absolute w-5 h-5 bg-yellow-400 rounded-full animate-float opacity-80" style={{ left: '50%', animationDelay: '4s', animationDuration: '8s' }}></div>
            {/* FSH dot */}
            <div className="absolute w-5 h-5 bg-green-400 rounded-full animate-float opacity-80" style={{ left: '70%', animationDelay: '6s', animationDuration: '8s' }}></div>
          </div>
        </div>

        {/* Benefit Cards */}
        <div className="benefits grid grid-cols-3 gap-4 my-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Hormone Tracking</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Smile className="h-6 w-6 text-pink-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Mood Insights</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Energy Guide</p>
          </div>
        </div>

        {/* Abstract App Preview */}
        <div className="app-preview flex justify-center my-8">
          <div className="w-64 h-32 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-4 left-4 w-16 h-4 bg-white/40 rounded-md"></div>
            <div className="absolute top-12 left-4 w-24 h-4 bg-white/30 rounded-md"></div>
            <div className="absolute top-20 left-4 w-20 h-4 bg-white/50 rounded-md"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-4 left-4 right-4 h-6 bg-white/20 rounded-lg"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons space-y-4">
          <Button
            onClick={handlePrimaryClick}
            className={`w-full py-6 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
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
            className="w-full py-6 text-xl font-bold rounded-full border-2 border-purple-500 text-purple-700 bg-transparent hover:bg-purple-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            CREATE ACCOUNT
          </Button>

          {/* Google login button */}
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              className="bg-white/60 hover:bg-white/80 text-gray-800 hover:text-gray-900 gap-2 rounded-full aspect-square h-14 w-14 flex items-center justify-center p-0 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-300"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              {loadingProvider === 'google' ? (
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-800" />
              ) : (
                <Icons.google className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Social Proof Footer */}
        <div className="footer-text text-center mt-8">
          <p className="text-base text-gray-700 font-medium">
            Join 250k+ people mastering their cycles
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
