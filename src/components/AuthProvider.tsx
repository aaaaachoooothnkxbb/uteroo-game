
import React from 'react';
import { CustomAuthProvider, useCustomAuth } from '@/hooks/useCustomAuth';

// Re-export the auth hook for compatibility
export const useAuth = () => {
  const { user, isLoading } = useCustomAuth();
  return { 
    user: user ? { 
      id: user.id, 
      email: user.email || `${user.username}@custom.local` 
    } : null, 
    isLoading 
  };
};

// Main provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CustomAuthProvider>
      {children}
    </CustomAuthProvider>
  );
};
