
import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/ui/icons";
import { Provider } from "@supabase/supabase-js";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Background Image URL:', '/lovable-uploads/a585fafe-c555-4646-816f-5f58fe5c005f.png');
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/dashboard");
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
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
      } else if (data) {
        console.log('Auth successful:', data);
        toast({
          title: "Success",
          description: "Successfully logged in!"
        });
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
    }
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-black relative overflow-hidden bg-white">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-4 mt-48">
          <img 
            src="lovable-uploads/c5a4901b-e045-4e02-b1dd-f6361280d983.png"
            alt="Uteroo Character"
            className="w-[500px] h-[500px] object-contain animate-[bounce_2s_ease-in-out_infinite]"
          />
          <div className="w-80 h-24 bg-pink-100 rounded-2xl flex items-center justify-center shadow-lg hover:bg-pink-200 transition-all duration-300 transform hover:scale-105">
            <img
              src="lovable-uploads/790172fa-27b1-4ab3-a3ef-3f10cdac5181.png"
              alt="Uteroo"
              className="h-20 w-auto object-contain animate-pulse"
            />
          </div>
        </div>

        <p className="text-center text-xl font-medium mt-6 text-gray-700">
          Discover your hormones, moods, and energy in a fun way!
        </p>

        <div className="space-y-4 mt-8">
          <div 
            onClick={() => navigate("/pou-game")}
            className="w-full h-40 relative cursor-pointer group"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('lovable-uploads/e47907e6-61da-4860-97dc-47179e32bcf8.png')] bg-cover bg-center bg-no-repeat scale-y-[-1] hover:scale-105 transition-transform duration-300 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <span className="text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                  TRY IT FIRST
                </span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setShowOnboarding(true)}
            className="w-full h-32 relative cursor-pointer group"
          >
            <div 
              className="absolute inset-0 bg-[url('lovable-uploads/896173af-7204-467f-986c-a542cc467697.png')] bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform duration-300 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                SIGN UP
              </span>
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
                <Icons.google className="h-8 w-8" />
              </Button>
              <Button
                variant="outline"
                className="bg-[#1877F2] text-white hover:bg-[#1864D9] gap-2 rounded-full aspect-square h-16 w-16 flex items-center justify-center p-0"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
              >
                <Icons.facebook className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
