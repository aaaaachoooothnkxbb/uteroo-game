import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import YogaGame from "./pages/YogaGame";
import RecipeGame from "./pages/RecipeGame";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-purple-400">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/lovable-uploads/8cc95945-7151-46d8-b54a-3bc04685f346.png')" }}
        />
        <div className="w-full h-screen overflow-hidden relative z-10">
          <div className="h-full overflow-auto bg-white/5 backdrop-blur-sm">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/yoga" element={<YogaGame />} />
                <Route path="/recipe" element={<RecipeGame />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;