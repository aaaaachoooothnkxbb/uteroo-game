
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import YogaGame from "./pages/YogaGame";
import RecipeGame from "./pages/RecipeGame";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";
import PouGame from "./pages/PouGame";
import PrePeriodGame from "./pages/PrePeriodGame";
import Videos from "./pages/Videos";
import { SplashScreen } from "./components/SplashScreen";
import { audioService } from "./utils/audioService";
import { AuthProvider } from "./components/AuthProvider";
import "./styles/typewriter.css";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);
  
  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    
    // Start ambient background music after splash screen completes
    if (!audioService.getMuted() && !audioService.getCategoryMuted('ambient') && !audioService.isAmbientBackgroundPlaying()) {
      audioService.startAmbientBackground('calm_loop'); // Use the new calming sound
    }
  };

  // Always show splash screen on app load, removing the localStorage check
  useEffect(() => {
    // Start ambient background music immediately if splash is skipped
    if (!showSplash && !audioService.getMuted() && !audioService.getCategoryMuted('ambient') && !audioService.isAmbientBackgroundPlaying()) {
      audioService.startAmbientBackground('calm_loop'); // Use the new calming sound
    }
  }, [showSplash]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="w-full h-screen overflow-hidden relative z-10">
              {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
              <div className={`h-full overflow-auto transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                    <Route path="/yoga" element={<YogaGame />} />
                    <Route path="/recipe" element={<RecipeGame />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/pou-game" element={<PouGame />} />
                    <Route path="/pre-period-game" element={<PrePeriodGame />} />
                    <Route path="/videos" element={<Videos />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </div>
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
