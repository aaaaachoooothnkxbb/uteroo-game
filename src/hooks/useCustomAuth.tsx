
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CustomUser {
  id: string;
  username: string;
  email?: string;
}

interface CustomAuthContextType {
  user: CustomUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const CustomAuthContext = createContext<CustomAuthContextType | null>(null);

export const CustomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user on app start
    const storedUser = localStorage.getItem('custom_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('custom_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-login', {
        body: { username, password }
      });

      if (error || data.error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: data?.error || error?.message || "Invalid credentials",
        });
        return false;
      }

      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email
      };

      setUser(userData);
      localStorage.setItem('custom_user', JSON.stringify(userData));

      toast({
        title: `Welcome back ${username}!`,
        description: "Login successful!",
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
      return false;
    }
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-signup', {
        body: { username, password }
      });

      if (error || data.error) {
        toast({
          variant: "destructive",
          title: "Account creation failed",
          description: data?.error || error?.message || "Failed to create account",
        });
        return false;
      }

      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: `${data.user.username}@custom.local`
      };

      setUser(userData);
      localStorage.setItem('custom_user', JSON.stringify(userData));

      toast({
        title: "Account created!",
        description: "Welcome to Uteroo!",
      });

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Account creation failed",
        description: "An unexpected error occurred",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('custom_user');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <CustomAuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </CustomAuthContext.Provider>
  );
};

export const useCustomAuth = () => {
  const context = useContext(CustomAuthContext);
  if (!context) {
    throw new Error('useCustomAuth must be used within a CustomAuthProvider');
  }
  return context;
};
