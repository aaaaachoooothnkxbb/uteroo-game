
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Icons } from "@/components/ui/icons";

interface AccountCreationProps {
  onComplete: () => void;
}

export const AccountCreation = ({ onComplete }: AccountCreationProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      // Create account with email (using username as email for simplicity)
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
        onComplete();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-black relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Character */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-20 scale-110"></div>
            <img 
              src="/lovable-uploads/6d9ab694-126c-44a1-9920-f40be00112b1.png"
              alt="Uteroo Character"
              className="w-[200px] h-[200px] object-contain drop-shadow-2xl relative z-10"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-lg text-gray-600">
              Join Uteroo and start your journey! ✨
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-2xl">
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[#9370DB] outline-none text-lg"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Set Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[#9370DB] outline-none text-lg"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleSave}
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? "Creating Account..." : "Save"}
            </Button>

            <div className="text-center text-gray-500">
              <span>or</span>
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={loadingProvider === 'google'}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 text-lg font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Icons.google className="w-6 h-6" />
              {loadingProvider === 'google' ? "Signing in..." : "Continue with Google"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
