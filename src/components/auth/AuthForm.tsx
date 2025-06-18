
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";

interface AuthFormProps {
  username: string;
  password: string;
  isLoading: boolean;
  isLoginLoading: boolean;
  loadingProvider: 'google' | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSave: () => void;
  onLogin: () => void;
  onGoogleLogin: () => void;
}

export const AuthForm = ({
  username,
  password,
  isLoading,
  isLoginLoading,
  loadingProvider,
  onUsernameChange,
  onPasswordChange,
  onSave,
  onLogin,
  onGoogleLogin,
}: AuthFormProps) => {
  return (
    <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-2xl">
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[#9370DB] outline-none text-lg"
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[#9370DB] outline-none text-lg"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={onSave}
            disabled={isLoading || !username.trim() || !password.trim()}
            className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {isLoading ? "Creating Account..." : "Save"}
          </Button>

          <Button
            onClick={onLogin}
            disabled={isLoginLoading || !username.trim() || !password.trim()}
            className="flex-1 bg-gradient-to-r from-indigo-400 to-blue-400 hover:from-indigo-500 hover:to-blue-500 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {isLoginLoading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <div className="text-center text-gray-500">
          <span>or</span>
        </div>

        <Button
          onClick={onGoogleLogin}
          disabled={loadingProvider === 'google'}
          variant="outline"
          className="w-full flex items-center justify-center gap-3 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 text-lg font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Icons.google className="w-6 h-6" />
          {loadingProvider === 'google' ? "Signing in..." : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
};
