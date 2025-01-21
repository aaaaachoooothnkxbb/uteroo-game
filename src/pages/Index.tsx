import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [session, setSession] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        navigate("/dashboard");
      }
      if (event === 'USER_UPDATED') {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
      if (event === 'SIGNED_OUT') {
        setErrorMessage(""); // Clear errors on sign out
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'email_not_confirmed':
          return 'Please verify your email address before signing in.';
        case 'user_not_found':
          return 'No user found with these credentials.';
        case 'invalid_grant':
          return 'Invalid login credentials.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-purple-400 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('lovable-uploads/affe073e-32fe-4691-a9ae-c8a70dbacdc0.png')] bg-cover opacity-30 animate-float"></div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-4 -mt-24">
          <img 
            src="/lovable-uploads/c5a4901b-e045-4e02-b1dd-f6361280d983.png"
            alt="Uteroo Character"
            className="w-[500px] h-[500px] object-contain animate-[bounce_2s_ease-in-out_infinite]"
          />
          <div className="w-64 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-6xl font-bold font-sans tracking-wider text-white">
              UTEROO
            </span>
          </div>
        </div>

        <p className="text-center text-xl font-medium mt-6">
          Discover your hormones, moods, and energy in a fun way!
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mt-8">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9333ea',
                    brandAccent: '#7e22ce',
                  },
                },
              },
            }}
            providers={["google"]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;