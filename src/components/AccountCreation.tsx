
import { AuthBackground } from "./auth/AuthBackground";
import { AuthHeader } from "./auth/AuthHeader";
import { AuthForm } from "./auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

interface AccountCreationProps {
  onComplete: () => void;
  onShowQuestionnaire?: () => void;
}

export const AccountCreation = ({ onComplete, onShowQuestionnaire }: AccountCreationProps) => {
  const {
    username,
    password,
    isLoading,
    isLoginLoading,
    loadingProvider,
    setUsername,
    setPassword,
    handleSave,
    handleLogin,
    handleGoogleLogin,
  } = useAuth({ onComplete, onShowQuestionnaire });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-black relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <AuthBackground />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <AuthHeader />

        <AuthForm
          username={username}
          password={password}
          isLoading={isLoading}
          isLoginLoading={isLoginLoading}
          loadingProvider={loadingProvider}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSave={handleSave}
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
    </div>
  );
};
