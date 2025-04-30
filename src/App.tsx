
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
import PouGame from "./pages/PouGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="w-full h-screen overflow-hidden relative z-10">
          <div className="h-full overflow-auto">
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
                <Route path="/pou-game" element={<PouGame />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
